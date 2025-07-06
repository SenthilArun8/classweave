# ClassWeave - AI-Powered Daycare Management & Activity Generation

ClassWeave is a comprehensive Next.js application designed for daycare centers and parents, featuring AI-powered story generation, activity suggestions, and student management capabilities.

## 🌐 Live Application

🚀 **[Visit ClassWeave Live](https://classweave.vercel.app/)**

Experience the full application features including AI-powered activity generation, student management, and personalized story creation.

## 🌟 Features

### For Daycare Centers
- **Student Management**: Add, edit, and manage student profiles with detailed information
- **AI Story Generation**: Create personalized stories about daily activities for each child
- **Activity Tracking**: Log and manage daily activities for students
- **Sample Data**: Demo functionality with sample students and stories
- **User Authentication**: Secure login system for daycare staff

### For Parents
- **At-Home Activities**: Generate personalized educational activities for children at home
- **Activity Customization**: Tailor activities based on:
  - Child's age and developmental stage
  - Interests and personality traits
  - Available materials and time
  - Location preferences (indoor/outdoor)
  - Number of children participating
- **Activity Management**: Copy, print, and save generated activities
- **Non-Repetitive Generation**: Smart system avoids repeating similar activities

### Technical Features
- **AI Integration**: Google Vertex AI (Gemini) for content generation
- **Database**: MongoDB for data persistence
- **Authentication**: JWT and PASETO token-based authentication
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Cookie Consent**: GDPR-compliant privacy management
- **Analytics Integration**: Google Analytics and AdSense support

## 📱 Main Pages

- **Home** (`/`) - Landing page with navigation to key features
- **Students** (`/students`) - Student management interface
- **Add Student** (`/add-student`) - Add new students to the system
- **At Home Activities** (`/at-home`) - Generate activities for parents
- **Sample Stories** (`/sample-story`) - Demo story generation
- **Sample Students** (`/sample-students`) - Demo student profiles
- **About** (`/about`) - Information about the platform

## 🔧 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + PASETO
- **AI**: Google Vertex AI (Gemini 2.0)
- **Email**: Nodemailer integration

## 🏗️ Project Structure

```
classweave/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── components/        # Reusable React components
│   ├── contexts/          # React Context providers
│   └── [pages]/          # Application pages
├── lib/                   # Utility libraries
│   ├── config/           # Database and service configurations
│   ├── controllers/      # Business logic controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB schemas
│   └── utils/            # Helper utilities
├── public/               # Static assets
└── utils/                # Additional utilities
```

## 🔐 Authentication & Security

- JWT-based authentication for secure access
- PASETO tokens for additional security
- Environment variable protection for sensitive data
- GDPR-compliant cookie consent management
- Secure API endpoint protection

## 🎨 UI/UX Features

- Responsive design for all device sizes
- Interactive dropdowns and animations
- Loading states and error handling
- Print-friendly activity layouts
- Copy-to-clipboard functionality

## 🤖 AI Integration

The application uses Google Vertex AI for:
- **Story Generation**: Creating personalized stories about student activities
- **Activity Generation**: Generating educational at-home activities
- **Content Personalization**: Tailoring content based on child characteristics
- **Smart Repetition Avoidance**: Ensuring diverse content generation

## 📊 Database Schema

### Student Model
- Personal information (name, age, preferences)
- Activity history and stories
- Parent/guardian contact details

### User Model
- Authentication credentials
- Role-based access control
- Profile information

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended for Next.js apps)
- **Render** or other cloud platforms
- Custom server deployments


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

