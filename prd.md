# Product Requirements Document (PRD): StuGig

## 1. Product Overview
**Name:** StuGig
**Tagline:** The Smart Freelance Marketplace for Students
**Description:** StuGig is a full-featured, peer-to-peer freelance marketplace specifically designed for students. It empowers students to offer freelance services, post job requests, apply for jobs through bidding, hire peers, communicate in real-time, and make secure payments. The platform functions similarly to major freelance marketplaces (Fiverr, Upwork) but is heavily tailored to academic and student needs, featuring AI-powered matchmaking and bidding assistance to enhance the user experience and success rate.

## 2. Actors and Roles

### 2.1 Student Freelancer
**Responsibilities:**
- Create and manage a professional freelancer profile.
- List specific freelance services.
- Browse available job postings.
- Submit competitive bids and proposals.
- Communicate with clients effectively.
- Deliver completed work on time.
- Receive secure payments.
- Build a reputation through ratings and reviews.

**Main Features:**
- Profile & Service Management
- Job Bidding System
- Real-Time Messaging
- Earnings Tracking & Review Management
- AI-Powered Job Recommendations

### 2.2 Job Poster (Student / Client)
**Responsibilities:**
- Post detailed freelance jobs with budgets and deadlines.
- Review freelancer profiles and past work.
- Receive and evaluate bids.
- Hire the most suitable freelancers.
- Track project progress.
- Release payments upon completion.
- Provide constructive ratings and reviews.

**Main Features:**
- Job Posting & Bid Management
- Freelancer Hiring & Project Tracking
- Payment Management & Feedback Submission

### 2.3 Admin
**Responsibilities:**
- Manage platform users and activity.
- Moderate job listings and services to ensure quality and compliance.
- Resolve user disputes.
- Monitor overall platform health and performance.
- Track platform revenue and commission earnings.
- Handle reports of violations.

**Main Features:**
- User Management & Job Moderation
- Dispute Resolution & Reporting Tools
- Revenue Analytics & Platform Statistics

## 3. Core Features

### 3.1 Student Marketplace
- Comprehensive freelance service listings.
- Robust discovery mechanisms for clients to find services.

### 3.2 Job Bidding System
- Job posting functionality with custom parameters.
- Proposal and quote submission for freelancers.
- Streamlined bid comparison and selection for clients.

### 3.3 Real-Time Messaging
- Socket.io powered real-time chat between clients and freelancers.
- Typing indicators for active conversations.
- Secure file sharing within the chat.
- Persistent conversation history linked to specific jobs.

### 3.4 Role-Based Dashboards
- **Freelancer Dashboard:** Manage services, bids, active/completed jobs, and earnings.
- **Client Dashboard:** Manage posted jobs, received bids, active projects, and payment history.
- **Admin Dashboard:** Moderation, analytics, and user management.

### 3.5 Secure Payments
- Razorpay integration for secure, reliable transactions.
- Escrow-like payment flow to protect both parties.
- Automated platform commission system (15% flat rate).

### 3.6 Ratings and Reviews
- Dual-sided rating system (freelancer ratings and client ratings).
- Reputation building based on historical performance.

### 3.7 Browse and Filter System
- Advanced filtering by category, price, rating, and delivery time to optimize discovery.

## 4. AI Features

### 4.1 AI-Powered Job Matchmaker
**Purpose:** Intelligently connect the right freelancers with the right jobs.
**Analysis Data:**
- Freelancer skills, past performance, and bidding history.
- Client requirements and user behavior.
- Platform feedback.
**Outputs:**
- *For Freelancers:* Recommended jobs, match scores, and compatibility ratings.
- *For Clients:* Recommended freelancers, skill matching analysis, and hiring recommendations.

### 4.2 AI-Driven Smart Bidding Assistant
**Purpose:** Assist freelancers in creating highly competitive, optimized proposals.
**Analysis Data:**
- Specific job requirements.
- Freelancer profile, skills, and historical project success.
**Outputs:**
- Tailored proposal content suggestions.
- Recommended pricing strategies.
- Suggested delivery timelines.
- Calculated probability of bid success.

## 5. Required Web Pages / User Flows

1. **Landing Page (`/`)**
   - Hero section, featured freelancers/services, platform overview, AI Matchmaker promotion, and Auth CTAs.
2. **Authentication Pages (`/signup`, `/login`)**
   - Registration/Login, role selection, and JWT-based authentication.
3. **Freelancer Dashboard**
   - My Services, Active Bids, Accepted/Completed Jobs, Messages, Profile Settings, Earnings, and AI Matchmaker section.
4. **Client Dashboard**
   - Posted Jobs, Received Bids, Hired Freelancers, Payment History, Ratings Given, Active Projects.
5. **Browse Services (`/services`)**
   - Discovery tools with category, price, rating, and delivery time filters. Hire, Message, and View Profile actions.
6. **Post a Job (`/jobs/new`)**
   - Form including title, description, budget, deadline, category, and file uploads.
7. **Job Listings & Bidding**
   - Active listings, details, proposal/quote submission, and Smart Bidding Assistant integration.
8. **Inbox / Chat Module (`/messages`)**
   - Real-time chat, file sharing, and job-specific threads.
9. **Payment Page (`/payment`)**
   - Razorpay integration, transaction tracking, payouts, and platform commission tracking.
10. **Reviews & Ratings**
    - Feedback management and reputation display.
11. **Public Profile Page (`/profile/:id`)**
    - User skills, reviews, ratings, portfolio, listed services, and completed projects.
12. **Admin Dashboard**
    - User/Job moderation, dispute resolution, and analytics.

## 6. Technical Stack Requirements
*No deviations or alternatives are permitted for the following technologies.*

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** Context API or Redux Toolkit

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js

### Database
- **Primary Database:** MongoDB or PostgreSQL

### Authentication & Security
- **Auth Flow:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt

### Real-Time Communications
- **WebSockets:** Socket.io

### Payment Processing
- **Gateway:** Razorpay

### Deployment Options
- Render, Vercel, Heroku, or AWS
