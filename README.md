# WELCOME TO CLASSWEAVE AI

ClassWeave uses AI to create personalized educational activities for children. We help educators manage students and assist parents with engaging at-home activities tailored to each child's needs.

Check it out at **https://classweave.vercel.app**

---

<p align="center">
  <img src="public/Screenshot 2025-07-06 180428.png" width="700" alt="ClassWeave AI Landing Page">
</p>

## **For Daycare Centers & Educators**

Transform your classroom experience with intelligent student management and AI-powered story generation. Track each child's progress, generate personalized activity suggestions, and create meaningful stories that parents will treasure. Our platform helps you document learning moments and communicate effectively with families.

<p align="center">
  <img src="public/Screenshot 2025-07-06 180549.png" width="400" alt="Student Profile Management">
  <span style="display:inline-block; width:50px;"></span>
  <img src="public/Screenshot 2025-07-06 180623.png" width="400" alt="AI Activity Suggestions">
</p>

### Key Features for Educators:
- **Smart Student Profiles**: Comprehensive tracking of each child's development, interests, and progress
- **AI Story Generation**: Create personalized stories about daily activities using Google Vertex AI
- **Activity Documentation**: Log and manage daily activities with detailed observations
- **Parent Communication**: Share meaningful updates and progress with families via the story creation specialized for storypark
- **Sample Data**: Demo functionality to explore features before implementation

## **For Parents & Families**

Extend learning beyond the classroom with our AI-powered at-home activity generator. Get personalized educational activities tailored to your child's age, interests, and available materials. Never run out of engaging, developmentally appropriate activities to do at home. OR if you'd simply like to leave your child engaged to allow for some personal time, this can accomplish that.

<p align="center">
  <img src="public/Screenshot 2025-07-06 180944.png" width="400" alt="At-Home Activity Generator">
</p>

### Key Features for Parents:
- **Personalized Activities**: AI generates activities based on your child's specific needs and interests
- **Flexible Options**: Indoor/outdoor activities, various durations, solo or group activities
- **Smart Customization**: Considers available materials, learning goals, and child's dislikes
- **Easy Management**: Copy, print, and save activities for future reference
- **Non-Repetitive**: Smart system ensures fresh, engaging content every time

---

## 🚀 **Live Demo & Sample Features**

Experience ClassWeave's powerful features through our comprehensive demo:

| Feature | Description | Demo Link |
|---------|-------------|-----------|
| 🏠 **At-Home Activities** | Generate personalized activities for your child | [Try Generator](https://classweave.vercel.app/at-home) |
| 👥 **Sample Students** | Explore student profile management | [View Profiles](https://classweave.vercel.app/sample-students) |
| 📚 **Sample Stories** | See AI-generated educational stories | [Read Stories](https://classweave.vercel.app/sample-story) |


<p align="center">
  <img src="public/Screenshot 2025-07-06 180428.png" width="600" alt="ClassWeave Feature Showcase">
</p>

## 🔧 **Technology & Architecture**

### AI-Powered Intelligence
- **Google Vertex AI (Gemini 2.0)**: Advanced natural language processing for story and activity generation
- **Smart Content Generation**: Context-aware AI that understands child development principles
- **Non-Repetitive Logic**: Sophisticated algorithms prevent duplicate content

### Modern Tech Stack
- **Frontend**: Next.js 15 with App Router, React 18, Tailwind CSS
- **Backend**: Node.js with RESTful API architecture
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + PASETO secure token implementation
- **Analytics**: Google Analytics 4 with GDPR compliance

### Performance & Security
- **Server-Side Rendering**: Optimized SEO and fast initial page loads
- **Mobile-First Design**: Responsive across all device sizes
- **Privacy-First**: GDPR-compliant cookie consent and data protection
- **Secure APIs**: Protected endpoints with rate limiting and validation

## 🏗️ **Project Architecture**

```
classweave/
├── app/                    # Next.js 15 App Router
│   ├── api/               # RESTful API endpoints
│   │   ├── ai/           # AI service integrations
│   │   ├── auth/         # Authentication routes
│   │   └── students/     # Student management APIs
│   ├── components/        # Reusable React components
|   |    └── clientComponents/  # Client-side interactive components
│   ├── contexts/          # React Context providers (User, Auth)
│   └── [pages]/          # Application pages with SEO optimization
├── lib/                   # Core business logic
│   ├── config/           # Database & service configurations
│   ├── controllers/      # API business logic
│   ├── middleware/       # Authentication & validation
│   ├── models/           # MongoDB schemas & models
│   └── utils/            # Helper utilities
├── public/               # Static assets & SEO files
│   ├── images/          # Screenshots & media
│   ├── sitemap.xml      # SEO sitemap
│   └── robots.txt       # Crawler instructions
└── utils/                # Additional utilities & configurations
```

## 🔐 **Security & Privacy**

### Authentication System
- **Multi-Layer Security**: JWT + PASETO token combination
- **Role-Based Access**: Differentiated permissions for educators vs. parents
- **Session Management**: Secure token refresh and logout mechanisms

### Data Protection
- **GDPR Compliance**: Comprehensive cookie consent and data management
- **Environment Security**: All sensitive data protected via environment variables
- **API Security**: Rate limiting, input validation, and SQL injection prevention
- **Child Data Protection**: Special consideration for sensitive child information

## 🎨 **User Experience**

### Design Philosophy
- **Child-Centric Design**: Warm, approachable color schemes and typography
- **Accessibility First**: WCAG compliant with screen reader support
- **Mobile Optimization**: Touch-friendly interfaces with responsive layouts
- **Performance Focus**: Fast loading times and smooth interactions

### Interactive Features
- **Real-Time Feedback**: Loading states, success confirmations, and error handling
- **Copy & Share**: Easy activity sharing with clipboard and print functionality
- **Smart Forms**: Auto-validation and helpful input suggestions
- **Progressive Enhancement**: Works beautifully even with JavaScript disabled

## 🤖 **AI Integration & Intelligence**

### Vertex AI Implementation
Our AI system leverages Google's most advanced language models to create truly personalized educational content:

- **Context-Aware Generation**: AI understands child development stages and learning theories
- **Adaptive Content**: Generates age-appropriate activities with proper complexity levels
- **Multi-Modal Output**: Creates comprehensive activities with materials, instructions, and learning outcomes
- **Continuous Learning**: System improves recommendations based on user interactions

### Smart Features
- **Non-Repetitive Content**: Advanced algorithms ensure fresh, diverse activities
- **Developmental Alignment**: Activities aligned with early childhood development milestones
- **Safety-First**: All generated content reviewed for age-appropriateness and safety
- **Personalization Engine**: Deep customization based on individual child profiles

<p align="center">
  <img src="public/Screenshot 2025-07-06 180623.png" width="500" alt="AI Content Generation Workflow">
</p>

## 📊 **Database & Data Management**

### Student Data Model
```javascript
{
  name: String,
  age: Number,
  interests: [String],
  developmentalStage: String,
  personality: String,
  learningStyle: String,
  activityHistory: [ActivitySchema],
  stories: [StorySchema],
  goals: [String]
}
```

### Activity Tracking
- **Comprehensive Logging**: Detailed activity records with outcomes and observations
- **Progress Monitoring**: Track skill development and learning milestones
- **Parent Sharing**: Secure sharing of progress reports and stories
- **Analytics Dashboard**: Insights into learning patterns and preferences

## 🚀 **Deployment & Scaling**

### Production Environment
- **Vercel Deployment**: Optimized for Next.js with automatic scaling and edge caching
- **Global CDN**: Fast content delivery through Vercel's Edge Network
- **Environment Management**: Secure configuration management across environments
- **Performance Monitoring**: Built-in analytics and Core Web Vitals tracking

### Scalability Features
- **Serverless Architecture**: Auto-scaling API endpoints via Vercel
- **Next.js Optimization**: Built-in static generation and SSR caching
- **Image Optimization**: WebP/AVIF formats with responsive sizing

## 🌟 **Impact & Future Vision**

### Educational Impact
- **Bridging Home-School Gap**: Seamless learning continuity between daycare and home
- **Empowering Educators**: AI-assisted tools that enhance rather than replace human expertise
- **Supporting Parents**: Accessible, expert-designed activities for busy families
- **Child Development**: Research-backed approaches to early childhood learning, specializing in Ontario based information

### Roadmap
- 📱 **Mobile App**: Native iOS and Android applications
- � **Advanced Research**: Even higher quality outputs that consider relevant research articles and industry standard publications

---

<p align="center">
  <a href="https://classweave.vercel.app">🌐 Live Demo</a> • 
  <a href="https://classweave.vercel.app/about">📋 About</a> • 
  <a href="https://classweave.vercel.app/at-home">🏠 Try At-Home Generator</a>
</p>

