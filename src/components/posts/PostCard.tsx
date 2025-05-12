import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { ThumbsUp, ThumbsDown, MessageCircle, Flag, MapPin, Tag, Trash2 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { votePost, deletePost } from '../../services/posts';
import { ReportModal } from './ReportModal';
import api from '../../services/api';

interface PostCardProps {
  post: Post;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [userVote, setUserVote] = useState<1 | -1 | null>(post.currentUserVote || null);

  // Calculate net votes
  const netVotes = post.upvotes - post.downvotes;

  // Format the creation date
  const formattedDate = DateTime
  .fromISO(post.createdAt, { zone: 'utc' })
  .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  .toRelative(); // ex: "3 minutes ago"

  // Check if the logged in user is the post author
  const isAuthor = user?.id === post.userId;

  const handleVote = async (voteType: 1 | -1) => {
    if (!user) return;

    setLoading(true);
    try {
      if (userVote === voteType) {
        // A apăsat din nou pe același vot => ștergem votul
        await api.delete(`/votes/${post.id}?userId=${user.id}`);
        setUserVote(null);
      } else {
        // Fie e prima dată, fie schimbă votul
        await votePost({
          postId: post.id,
          userId: user.id,
          voteType: voteType,
        });
        setUserVote(voteType);
      }

      if (onPostUpdated) {
        onPostUpdated(); // ca să updatezi scorul la post
      }
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!user || !isAuthor) return;

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await deletePost(post.id, user.id);
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
        <div className="p-5">
          {/* Post Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-medium text-indigo-400">{post.userAlias}</p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-200 mb-3">{post.text}</p>

            {(post.images ?? []).length > 0 && (
              <div className={`grid gap-2 ${(post.images ?? []).length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mb-3`}>
                {(post.images ?? []).slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-video overflow-hidden rounded-md">
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags and Location */}
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-indigo-900/50 text-indigo-300 py-1 px-2 rounded-full"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {post.latitude && post.longitude && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-900/50 text-blue-300 py-1 px-2 rounded-full">
                  <MapPin size={12} />
                  Localized
                </span>
              )}
            </div>
          </div>

          {/* Post Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-2">
            <button
                onClick={() => handleVote(1)}
                disabled={loading}
                className={`flex items-center space-x-1 rounded-md px-2 py-1 ${userVote === 1 ? 'text-green-400 bg-green-900/30' : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <ThumbsUp size={16} />
              </button>

              <span className={`text-sm font-medium ${netVotes > 0 ? 'text-green-400' : netVotes < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                {netVotes}
              </span>

              <button
                onClick={() => handleVote(-1)}
                disabled={loading}
                className={`flex items-center space-x-1 rounded-md px-2 py-1 ${userVote === -1 ? 'text-red-400 bg-red-900/30' : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <ThumbsDown size={16} />
              </button>

            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/post/${post.id}`}
                className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="text-sm">{post.commentCount}</span>
              </Link>

              {user && (
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Flag size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        postId={post.id}
      />
    </>
  );
};