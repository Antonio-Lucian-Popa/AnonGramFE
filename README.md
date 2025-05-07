# 🕵️‍♂️ AnonGram – Anonymous & Local Social Network

AnonGram este o aplicație web care permite utilizatorilor să posteze anonim, să comenteze, să voteze și să raporteze conținut, totul localizat geografic. Este construită ca un MVP scalabil, folosind Spring Boot, PostgreSQL, Keycloak și React.js.

---

## 📦 Tehnologii folosite

### Backend (Java)
- Spring Boot 3
- PostgreSQL
- Keycloak (OAuth2)
- ModelMapper (DTO mapping)
- Multipart file upload
- REST API with pagination & validation

### Frontend (React)
- React.js + TypeScript
- Axios (API calls)
- Tailwind CSS (UI styling)
- Context API (auth state)
- Lucide icons

---

## 🛠️ Funcționalități

### ✅ Utilizatori
- Înregistrare cu alias anonim
- Autentificare cu Keycloak (access + refresh token)
- Refresh token fără relogare
- Protejare rute private

### ✅ Postări
- Creare post anonim (text + locație + imagini)
- Feed paginat
- Detalii post + comentarii
- Vot (like/dislike)
- Ștergere dacă ești autor

### ✅ Comentarii
- Adăugare și ștergere comentarii (dacă ești autor)
- Vizualizare paginată pe post

### ✅ Voturi
- Un singur vot per post per user
- Validare la backend + excepție

### ✅ Rapoarte
- Raportează postări
- Vizualizare rapoarte (doar pentru admin)

---

## 🔐 Autentificare (Keycloak)

Folosește Keycloak pentru:
- Înregistrare și login utilizatori
- Acces protejat cu JWT + refresh token
- Admin API pentru creare/ștergere useri

---
