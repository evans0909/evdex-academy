# EvDeX Academy

![EvDeX Academy Banner](https:///home/ev4ns/projects/evdex-academy/src/assets/hero-students.jpg/1200x400/4F46E5/FFFFFF?text=EvDeX+Academy+-+Learn+to+Code+Collaboratively)

**A collaborative web-based platform for peer-led programming education**

## 🌟 Overview

EvDeX Academy is a community-driven platform where users can create, enroll in, and participate in coding "talks" (peer-led classes). The platform facilitates collaborative learning through study materials, discussion forums, and interactive coding sessions.

### Key Features
- **User Authentication** - Secure login/register with role-based access (learner/teacher/admin)
- **Talk Management** - Create, browse, and enroll in coding talks
- **University Resources** - Access study materials and past papers from Zambian universities
- **Real-time Collaboration** - Interactive learning environment with peer support
- **Admin Dashboard** - Comprehensive user and content management
- **Responsive Design** - Mobile-first approach for all screen sizes

## 🚀 Live Demo

**Website:** [https://evdex-academy.web.app](https://evdex-academy.web.app)  
**Admin:** [https://evdex-academy.web.app/admin](https://evdex-academy.vercel.app/admin)

## 📁 Project Structure
evdex-academy/
├── frontend/ # React + TypeScript frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Application pages
│ │ │ ├── Index.tsx # Homepage
│ │ │ ├── talks/ # Talks feature pages
│ │ │ ├── Universities.tsx # University resources
│ │ │ └── AdminDashboard.tsx # Admin panel
│ │ ├── hooks/ # Custom React hooks
│ │ ├── lib/ # Firebase configuration
│ │ └── types/ # TypeScript type definitions
│ └── public/ # Static assets
├── backend/ # Firebase backend
│ ├── functions/ # Cloud Functions
│ └── firestore/ # Database rules & indexes
└── docker/ # Docker configuration

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **Framer Motion** - Animations

### Backend
- **Firebase Authentication** - User management
- **Firestore Database** - NoSQL database
- **Firebase Cloud Functions** - Serverless backend
- **Firebase Storage** - File storage

### DevOps
- **Docker** - Containerization
- **GitHub** - Version control
- **Vercel/Netlify** - Frontend hosting
- **Firebase Hosting** - Backend deployment

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ & npm
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/evans0909/evdex-academy.git
cd evdex-academy

## Install dependencies
npm install

Start development servers

bash
# Method 1: Using npm
npm run dev

# Method 2: Using Docker
npm run docker:up

Firebase Setup
Create Firebase Project

Go to Firebase Console

Create new project "evdex-academy"

Enable Authentication, Firestore, and Functions

Configure Firestore

bash
firebase login
firebase init
# Select: Firestore, Functions, Hosting, Emulators
Deploy Backend

bash
cd backend
firebase deploy
🎯 Features in Detail
For Learners
Browse available coding talks by category/difficulty

Enroll in talks and access course materials

Download study materials from Zambian universities

Participate in discussion forums

Track learning progress

For Instructors
Create and manage coding talks

Upload course materials and resources

Schedule live coding sessions

Manage enrolled students

Receive feedback and ratings

For Admins
Full user management (promote/demote users)

Content moderation

System analytics and reporting

University program management

University Resources
Access to study materials from:

Kapasa Makasa University (KMU)

University of Zambia (UNZA)

Copperbelt University (CBU)

Mulungushi University (MU)

Year-wise course materials

Past examination papers

Google Drive integration for resource sharing

🔐 Authentication & Security
Email/Password authentication

Role-based access control (RBAC)

Protected routes for authenticated users

Admin-only access for sensitive operations

Firebase Security Rules for database protection

📱 Pages
Homepage - Platform introduction and features

Talks Listing - Browse all available coding talks

Talk Detail - Detailed view with enrollment option

Create Talk - Form for instructors to create new talks

My Talks - User's enrolled and created talks

Universities - Access university study materials

Admin Dashboard - User and content management

Login/Register - Authentication pages

Repairs & Donations - Community services

Schedule Meeting - Book appointments with instructors

🗄️ Database Schema
Collections
users - User profiles and authentication data

talks - Coding talks with metadata and content

enrollments - User enrollments in talks

universities - University information and programs

materials - Study materials and past papers

admins - Administrator accounts

🚢 Deployment
Frontend Deployment (Vercel)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
Backend Deployment (Firebase)
bash
# Deploy all services
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
📊 Environment Variables
env
# Frontend (.env.local)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5001/your-project/us-central1/api

# Backend (Firebase Functions)
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React - UI Library

Firebase - Backend Services

Tailwind CSS - Styling Framework

shadcn/ui - Component Library

All contributors and testers

📞 Contact
Evans Devancie Bwalya

Email: ev4nsbw4ly4@gmail.com

GitHub: evans0909

LinkedIn: Evans Bwalya

Project Link: https://github.com/evans0909/evdex-academy

<div align="center"> Made with ❤️ for the Zambian tech community </div> ```

