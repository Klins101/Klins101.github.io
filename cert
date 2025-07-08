<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <div class="container">
        <h1>My Dashboard</h1>
        <p>Welcome back, {{ userFirstName }}!</p>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3">
            <div class="dashboard-sidebar">
              <div class="user-profile">
                <div class="profile-image">
                  <img :src="profileImageUrl" alt="Profile Photo" />
                </div>
                <div class="profile-info">
                  <h4>{{ userFullName }}</h4>
                  <p>{{ userCategory }}</p>
                  <p v-if="isImpersonating" class="impersonation-notice">
                    <i class="bi bi-eye-fill"></i> Impersonating User
                    <button class="btn btn-sm btn-warning" @click="exitImpersonation">
                      Exit
                    </button>
                  </p>
                </div>
              </div>
              
              <div class="sidebar-menu">
                <div 
                  v-for="(item, index) in menuItems" 
                  :key="`menu-${index}`"
                  class="menu-item"
                  :class="{ active: activeSection === item.value }"
                  @click="activeSection = item.value"
                >
                  <div class="menu-icon">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="menu-text">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Content Area -->
          <div class="col-lg-9">
            <!-- Dashboard Overview -->
            <div v-if="activeSection === 'overview'" class="dashboard-section">
              <h2>Dashboard Overview</h2>
              
              <div class="stats-cards">
                <div class="row g-4">
                  <div class="col-md-4" v-for="(stat, index) in statsData" :key="`stat-${index}`">
                    <div class="stat-card" :class="`stat-${stat.color || 'primary'}`">
                      <div class="stat-icon">
                        <i :class="stat.icon"></i>
                      </div>
                      <div class="stat-info">
                        <div class="stat-value">{{ stat.value }}</div>
                        <div class="stat-label">{{ stat.label }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="recent-activities">
                <h3>Recent Activities</h3>
                
                <!-- Loading indicator -->
                <div v-if="isLoadingActivities" class="text-center py-4">
                  <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted">Loading your activity history...</p>
                </div>
                
                <!-- Empty state -->
                <div v-else-if="recentActivities.length === 0" class="empty-activities">
                  <div class="empty-state-icon">
                    <i class="bi bi-journal"></i>
                  </div>
                  <h4>No Activities Yet</h4>
                  <p>Start exploring courses and your activity will be tracked here!</p>
                </div>
                
                <!-- Activity list -->
                <div v-else class="activity-list">
                  <div class="activity-list-header">
                    <h5>Your activity history</h5>
                    <div class="activity-actions">
                      <button v-if="isViewingAllActivities" class="btn btn-sm btn-outline-secondary" @click="isViewingAllActivities = false">
                        Show Less
                      </button>
                      <button v-else-if="recentActivities.length > 5" class="btn btn-sm btn-outline-primary" @click="viewAllActivities">
                        View All
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    v-for="(activity, index) in displayedActivities" 
                    :key="`activity-${index}`" 
                    class="activity-item"
                    :class="{'new-activity': index === 0 && activity.timestamp > (Date.now() - 30000)}"
                  >
                    <div class="activity-icon" :class="`bg-${activity.color || 'primary'}-subtle`">
                      <i :class="activity.icon || getActivityIcon(activity.type)"></i>
                    </div>
                    <div class="activity-details">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-meta" v-if="activity.courseName || activity.lessonName">
                        <span v-if="activity.courseName">{{ activity.courseName }}</span>
                        <span v-if="activity.courseName && activity.lessonName">-</span>
                        <span v-if="activity.lessonName">{{ activity.lessonName }}</span>
                      </div>
                      <div class="activity-time">{{ activity.time }}</div>
                    </div>
                  </div>
                  
                  <!-- Empty state when viewing all but there are no more activities -->
                  <div v-if="isViewingAllActivities && recentActivities.length <= 5" class="text-center text-muted py-3">
                    <p>You've viewed all your activities.</p>
                  </div>
                  
                  <!-- View more button -->
                  <div v-if="!isViewingAllActivities && recentActivities.length > 5" class="text-center mt-3">
                    <button class="btn btn-sm btn-outline-primary" @click="viewAllActivities">
                      View All Activities ({{ recentActivities.length }})
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="upcoming-classes">
                <h3>Upcoming Classes</h3>
                <div class="class-list">
                  <div v-for="(cls, index) in upcomingClasses" :key="`class-${index}`" class="class-item">
                    <div class="class-date">
                      <div class="date-day">{{ cls.day }}</div>
                      <div class="date-month">{{ cls.month }}</div>
                    </div>
                    <div class="class-details">
                      <div class="class-title">{{ cls.title }}</div>
                      <div class="class-time">{{ cls.time }}</div>
                      <div class="class-instructor">Instructor: {{ cls.instructor }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- My Courses -->
            <div v-if="activeSection === 'courses'" class="dashboard-section">
              <h2>My Courses</h2>
              
              <!-- Loading Face Verification Status -->
              <div v-if="isCheckingFaceStatus" class="face-status-loading">
                <div class="loading-spinner">
                  <i class="bi bi-hourglass-split"></i>
                </div>
                <p>Checking face verification status...</p>
              </div>
              
              <!-- No Face Data Setup Notice -->
              <div v-else-if="!hasFaceData" class="face-setup-notice">
                <div class="setup-alert">
                  <div class="alert-icon">
                    <i class="bi bi-person-plus"></i>
                  </div>
                  <div class="alert-content">
                    <h3>🆔 Set Up Face Recognition</h3>
                    <p>To access your courses securely, please set up face recognition first.</p>
                    <button class="btn btn-success setup-btn" @click="goToFaceSetup">
                      <i class="bi bi-camera"></i> Set Up Face Recognition
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Face Verification Required Notice -->
              <div v-else-if="hasFaceData && !isCurrentlyVerified" class="face-verification-notice">
                <div class="verification-alert">
                  <div class="alert-icon">
                    <i class="bi bi-shield-exclamation"></i>
                  </div>
                  <div class="alert-content">
                    <h3>🔐 Face Verification Required</h3>
                    <p>To protect your account and ensure secure access, please verify your identity before viewing courses.</p>
                    <button class="btn btn-primary verification-btn" @click="triggerFaceVerificationForCourses">
                      <i class="bi bi-camera-video"></i> Start Face Verification
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Courses Grid (only shown after verification) -->
              <div v-else class="courses-grid">
                <div class="course-card-modern" v-for="(course, index) in myCourses" :key="`course-${index}`">
                  <div class="course-card-inner">
                    <!-- Course Image with Overlay -->
                    <div class="course-image-container">
                      <img 
                        :src="getCourseImage(course)" 
                        :alt="course.title" 
                        class="course-img"
                        @error="handleImageError($event, course)" />
                      
                      <!-- Overlay with Status and Action Button -->
                      <div class="course-overlay">
                        <a 
                          @click.prevent="handleCourseAccess(course)"
                          href="#"
                          class="course-action-btn">
                          <span v-if="course.status === 'completed'">
                            <i class="bi bi-arrow-repeat"></i> Review
                          </span>
                          <span v-else-if="course.status === 'in-progress'">
                            <i class="bi bi-play-fill"></i> Continue
                          </span>
                          <span v-else>
                            <i class="bi bi-play-fill"></i> Start
                          </span>
                        </a>
                      </div>
                      
                      <!-- Status Badge -->
                      <div class="course-status-ribbon" :class="`status-${course.status}`">
                        <span v-if="course.status === 'completed'">
                          <i class="bi bi-trophy-fill"></i> Completed
                        </span>
                        <span v-else-if="course.status === 'in-progress'">
                          <i class="bi bi-lightning-fill"></i> In Progress
                        </span>
                        <span v-else>
                          <i class="bi bi-book"></i> New Course
                        </span>
                      </div>
                    </div>
                    
                    <!-- Course Content Section -->
                    <div class="course-info">
                      <h3 class="course-title">{{ course.title }}</h3>
                      
                      <!-- Course Category & Type -->
                      <div class="course-meta">
                        <span class="course-category" v-if="course.category_display || course.category">
                          {{ formatCategory(course.category_display || course.category) }}
                        </span>
                        <span class="course-type" v-if="course.course_type">
                          {{ formatCourseType(course.course_type) }}
                        </span>
                      </div>
                      
                      <p class="course-description">{{ course.description }}</p>
                      
                      <!-- Progress Section -->
                      <div class="course-progress-wrapper">
                        <div class="progress-header">
                          <span class="progress-label">Progress</span>
                          <span class="progress-percentage" :class="{'complete': course.progress === 100}">
                            {{ course.progress }}%
                          </span>
                        </div>
                        
                        <div class="progress-bar-container">
                          <div class="progress-track">
                            <div class="progress-fill" 
                                 :class="`status-${course.status}`"
                                 :style="{width: `${course.progress}%`}"></div>
                          </div>
                        </div>
                        
                        <!-- Completed Date -->
                        <div v-if="course.completionDate" class="completion-info">
                          <i class="bi bi-calendar-check"></i>
                          Completed on {{ new Date(course.completionDate).toLocaleDateString() }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mock Exams -->
            <div v-if="activeSection === 'mocks'" class="dashboard-section">
              <div class="section-header-with-actions mb-4">
                <h2>Mock Exams</h2>
                <div class="section-actions">
                  <div class="search-filter">
                    <i class="bi bi-search"></i>
                    <input 
                      type="text" 
                      v-model="examSearchQuery" 
                      placeholder="Search exams..." 
                      class="form-control form-control-sm"
                    />
                  </div>
                  <div class="dropdown exam-type-filter">
                    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      <i class="bi bi-funnel"></i> {{ examTypeFilter || 'All Exams' }}
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" @click.prevent="examTypeFilter = ''">All Exams</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="examTypeFilter = 'MCQ'">MCQ Only</a></li>
                      <li><a class="dropdown-item" href="#" @click.prevent="examTypeFilter = 'OSCE'">OSCE Only</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div v-if="isLoadingExams" class="loading-indicator text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading mock exams...</p>
              </div>
              
              <div v-else-if="filteredMockExams.length === 0" class="no-exams-message text-center py-5">
                <div class="no-data-icon">
                  <i class="bi bi-clipboard-x"></i>
                </div>
                <h3 class="mt-3">No Mock Exams Available</h3>
                <p class="text-muted">There are no mock exams available for your selected courses.</p>
                <button class="btn btn-outline-primary mt-3" @click="refreshExams">
                  <i class="bi bi-arrow-clockwise me-2"></i> Refresh Exams
                </button>
              </div>
              
              <div v-else class="row g-4">
                <div class="col-lg-6 col-md-12" v-for="(exam, index) in filteredAndSearchedExams" :key="`exam-${index}`">
                  <div class="mock-exam-card" :class="{'completed-exam': hasUserTakenExam(exam.examId)}">
                    <div class="exam-status-ribbon" v-if="hasUserTakenExam(exam.examId)">
                      <div class="ribbon-content">
                        <i class="bi bi-check-circle-fill"></i> 
                        Completed
                      </div>
                    </div>
                    
                    <div class="exam-header">
                      <div class="exam-type-icon" :class="getExamTypeClass(exam.examType)">
                        <i :class="getExamTypeIcon(exam.examType)"></i>
                      </div>
                      <div class="exam-header-content">
                        <h3 class="exam-title">{{ exam.title }}</h3>
                        <div class="exam-badges">
                          <span class="badge rounded-pill bg-light text-dark">
                            <i class="bi bi-clock"></i> {{ exam.duration || '60 min' }}
                          </span>
                          <span class="badge rounded-pill bg-light text-dark">
                            <i class="bi bi-question-circle"></i> {{ exam.questions || '0' }} Questions
                          </span>
                          <span class="badge rounded-pill bg-light text-dark" v-if="exam.passmark">
                            <i class="bi bi-trophy"></i> Pass: {{ exam.passmark }}%
                          </span>
                        </div>
                      </div>
                      <div class="exam-score" v-if="hasUserTakenExam(exam.examId)">
                        <div class="score-circle" :class="getScoreClass(getBestAttemptScore(exam.examId))">
                          <div class="score-value">{{ getBestAttemptScore(exam.examId) }}%</div>
                          <div class="score-label">Best Score</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="exam-body">
                      <p class="exam-description">{{ exam.description || 'This mock exam helps you prepare for your upcoming assessment. It contains carefully selected questions that mirror the actual exam format.' }}</p>
                      
                      <div class="exam-details" v-if="hasUserTakenExam(exam.examId)">
                        <div class="detail-item">
                          <div class="detail-icon">
                            <i class="bi bi-calculator"></i>
                          </div>
                          <div class="detail-content">
                            <div class="detail-label">Attempts</div>
                            <div class="detail-value">{{ getAttemptCount(exam.examId) }}</div>
                          </div>
                        </div>
                        
                        <div class="detail-item">
                          <div class="detail-icon">
                            <i class="bi bi-calendar-check"></i>
                          </div>
                          <div class="detail-content">
                            <div class="detail-label">Last Attempt</div>
                            <div class="detail-value">{{ getLastAttemptDate(exam.examId) }}</div>
                          </div>
                        </div>
                        
                        <div class="detail-item">
                          <div class="detail-icon">
                            <i class="bi bi-graph-up"></i>
                          </div>
                          <div class="detail-content">
                            <div class="detail-label">Progress</div>
                            <div class="detail-value">{{ getProgressText(exam.examId) }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="exam-keywords" v-if="!hasUserTakenExam(exam.examId)">
                        <div class="keyword" v-for="(keyword, kIndex) in getExamKeywords(exam)" :key="`keyword-${kIndex}`">
                          {{ keyword }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="exam-footer">
                      <button 
                        v-if="hasUserTakenExam(exam.examId)"
                        class="btn btn-outline-info" 
                        @click="viewExamResults(exam.examId)">
                        <i class="bi bi-bar-chart-fill"></i> View Results
                      </button>
                      
                      <button 
                        @click="handleExamAccess(exam)"
                        class="btn"
                        :class="hasUserTakenExam(exam.examId) ? 'btn-outline-warning' : 'btn-primary'">
                        <i :class="hasUserTakenExam(exam.examId) ? 'bi bi-arrow-repeat' : 'bi bi-play-fill'"></i>
                        {{ hasUserTakenExam(exam.examId) ? 'Retake Exam' : 'Start Exam' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Profile -->
            <div v-if="activeSection === 'profile'" class="dashboard-section">
              <h2>My Profile</h2>
              
              <div class="profile-details">
                <div class="row">
                  <div class="col-md-4">
                    <div class="profile-image-large">
                      <img :src="profileImageUrl" alt="Profile Photo" />
                    </div>
                  </div>
                  
                  <div class="col-md-8">
                    <div class="profile-info-form">
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label class="form-label">First Name</label>
                          <input type="text" class="form-control" v-model="profileData.firstName" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Last Name</label>
                          <input type="text" class="form-control" v-model="profileData.lastName" />
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="profileData.email" disabled />
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">WhatsApp Number</label>
                        <input type="tel" class="form-control" v-model="profileData.whatsapp" />
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Category</label>
                        <div class="category-card">
                          <div class="category-icon">
                            <i :class="getCategoryIcon(profileData.category)"></i>
                          </div>
                          <div class="category-details">
                            <div class="category-name">{{ getCategoryName(profileData.category) }}</div>
                            <div class="category-description">{{ getCategoryDescription(profileData.category) }}</div>
                          </div>
                          <div class="category-badge" :class="getCategoryClass(profileData.category)">
                            <span>{{ getCategoryShortName(profileData.category) }}</span>
                          </div>
                        </div>
                        <div class="category-info">
                          <i class="bi bi-info-circle"></i>
                          <span>Your category was set during registration and determines your customized learning experience.</span>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Subscription Status</label>
                        <div class="subscription-status">
                          <span class="badge" :class="subscriptionStatusClass">{{ subscriptionStatusText }}</span>
                          <span>{{ subscriptionStatusMessage }}</span>
                        </div>
                      </div>
                      
                      <div class="d-grid">
                        <button class="btn btn-primary" @click="saveProfile">Save Changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="change-password mt-5">
                <h3>Change Password</h3>
                <div class="row">
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label">Current Password</label>
                      <input type="password" class="form-control" v-model="passwordData.current" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">New Password</label>
                      <input type="password" class="form-control" v-model="passwordData.new" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Confirm New Password</label>
                      <input type="password" class="form-control" v-model="passwordData.confirm" />
                    </div>
                    <div class="d-grid">
                      <button class="btn btn-outline-primary" @click="changePassword">Update Password</button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div><!-- End Profile -->
            
            <!-- OSCE Practice Section -->
            <div v-if="activeSection === 'osce'" class="dashboard-section">
              <h2 class="mb-4">OSCE Practice</h2>
              <p class="text-muted mb-4">Practice your clinical examination skills with our structured Objective Structured Clinical Examination (OSCE) modules designed to improve your diagnostic and procedural abilities.</p>
              
              <div v-if="isLoadingOsceExams" class="loading-indicator text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading OSCE practice modules...</p>
              </div>
              
              <div v-else-if="osceExams.length === 0" class="text-center py-5">
                <div class="no-data-icon">
                  <i class="bi bi-clipboard-pulse" style="font-size: 3rem; color: #dee2e6;"></i>
                </div>
                <h3 class="mt-3">No OSCE Exams Available</h3>
                <p class="text-muted">There are currently no OSCE practice modules available for your category. Please check back later!</p>
              </div>
              
              <div v-else>
                <!-- OSCE Practice Categories -->
                <div class="osce-categories mb-4">
                  <ul class="nav nav-tabs nav-fill">
                    <li class="nav-item">
                      <a 
                        class="nav-link" 
                        :class="{ active: osceTab === 'unmanned' }" 
                        href="#" 
                        @click.prevent="osceTab = 'unmanned'"
                      >
                        <i class="bi bi-clipboard-pulse me-2"></i> Unmanned OSCE
                        <span class="badge bg-primary ms-2">{{ unmannedOsceExams.length }}</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a 
                        class="nav-link" 
                        :class="{ active: osceTab === 'manned' }" 
                        href="#" 
                        @click.prevent="osceTab = 'manned'"
                      >
                        <i class="bi bi-person-video3 me-2"></i> Manned OSCE
                        <span class="badge bg-info ms-2">{{ mannedOsceExams.length }}</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a 
                        class="nav-link" 
                        :class="{ active: osceTab === 'diagnostics' }" 
                        href="#" 
                        @click.prevent="osceTab = 'diagnostics'"
                      >
                        <i class="bi bi-clipboard-data me-2"></i> Diagnostics
                        <span class="badge bg-purple ms-2">{{ filteredDiagnosticExams.length }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <!-- Unmanned OSCE Exams -->
                <div v-if="osceTab === 'unmanned'">
                  <div class="row g-4">
                    <div class="col-md-6" v-for="(exam, index) in unmannedOsceExams" :key="`osce-${index}`">
                      <div class="osce-exam-card" :class="{'taken-exam': hasUserTakenExam(exam.id)}">
                        <div class="exam-status-ribbon" v-if="hasUserTakenExam(exam.id)">
                          <span><i class="bi bi-check-circle-fill"></i> Completed</span>
                        </div>
                        <div class="exam-header">
                          <div class="exam-icon">
                            <i class="bi bi-clipboard-pulse"></i>
                          </div>
                          <div class="exam-info">
                            <h3 class="exam-title">{{ exam.title }}</h3>
                            <div class="exam-badges">
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-clock"></i> {{ exam.duration_minutes }} minutes
                              </span>
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-hospital"></i> {{ exam.station_count || calculateStationCount(exam) }} stations
                              </span>
                              <span class="badge bg-light text-dark" v-if="hasUserTakenExam(exam.id)">
                                <i class="bi bi-calendar-check"></i> Last: {{ getLastAttemptDate(exam.id) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-body">
                          <p>{{ exam.description || 'Practice your clinical skills with this unmanned OSCE exam.' }}</p>
                          
                          <div class="osce-features">
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Self-assessment format</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Clinical scenario analysis</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Detailed performance metrics</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-footer">
                          <button 
                            v-if="hasUserTakenExam(exam.id)" 
                            class="btn btn-outline-info me-2" 
                            @click="viewExamResults(exam.id)"
                          >
                            <i class="bi bi-bar-chart-fill me-1"></i> View Results
                          </button>
                          <button 
                            class="btn btn-primary" 
                            @click="handleExamAccess(exam)"
                          >
                            <i class="bi bi-play-fill me-1"></i> {{ hasUserTakenExam(exam.id) ? 'Retake Exam' : 'Start Exam' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Manned OSCE Section -->
                <div v-if="osceTab === 'manned'">
                  <div v-if="mannedOsceExams.length === 0" class="text-center py-5">
                    <div class="no-data-icon mb-3">
                      <i class="bi bi-person-video3" style="font-size: 3.5rem; color: #dee2e6;"></i>
                    </div>
                    <h3 class="mb-3">No Manned OSCE Stations Available</h3>
                    <p class="text-muted mb-4">There are currently no manned OSCE stations available. Please check back later!</p>
                    
                    <!-- Debug information -->
                    <div class="text-start mt-4 p-3 bg-light" style="max-width: 600px; margin: 0 auto;">
                      <h5>Debug Information:</h5>
                      <p><strong>Your subcategory:</strong> {{ getUserSubcategory() || 'Not set' }}</p>
                      <p><small>To see manned OSCE exams, your subcategory must match one of: nurse_course_exam, nurse_course_only, nurse_exam_only, foreign_exam_course_only</small></p>
                    </div>
                  </div>
                  
                  <div v-else class="row g-4">
                    <div class="col-md-6" v-for="(exam, index) in mannedOsceExams" :key="`manned-${index}`">
                      <div class="osce-exam-card manned-exam-card" :class="{'taken-exam': hasUserTakenExam(exam.id)}">
                        <div class="exam-status-ribbon" v-if="hasUserTakenExam(exam.id)">
                          <span><i class="bi bi-check-circle-fill"></i> Completed</span>
                        </div>
                        <div class="exam-header">
                          <div class="exam-icon manned-icon">
                            <i class="bi bi-person-video3"></i>
                          </div>
                          <div class="exam-info">
                            <h3 class="exam-title">{{ exam.station_details?.title || exam.title }}</h3>
                            <div class="exam-badges">
                              <span class="badge bg-info text-dark">
                                <i class="bi bi-person-badge"></i> Manned Station
                              </span>
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-clock"></i> {{ exam.station_details?.duration_minutes || 10 }} minutes
                              </span>
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-body-text"></i> {{ exam.body_part_requirements?.length || 0 }} body parts
                              </span>
                              <span class="badge bg-light text-dark" v-if="hasUserTakenExam(exam.id)">
                                <i class="bi bi-calendar-check"></i> Last: {{ getLastAttemptDate(exam.id) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-body">
                          <p>{{ exam.station_details?.scenario || 'Practice clinical examination skills with 3D human model interaction.' }}</p>
                          
                          <div class="osce-features">
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>3D Human Model Interaction</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Physical Examination Practice</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Immediate Scoring & Feedback</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-footer">
                          <button 
                            v-if="hasUserTakenExam(exam.id)" 
                            class="btn btn-outline-info me-2" 
                            @click="viewExamResults(exam.id)"
                          >
                            <i class="bi bi-bar-chart-fill me-1"></i> View Results
                          </button>
                          <button 
                            class="btn btn-primary" 
                            @click="handleExamAccess(exam)"
                          >
                            <i class="bi bi-play-fill me-1"></i> {{ hasUserTakenExam(exam.id) ? 'Retake Exam' : 'Start Exam' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Diagnostics Section -->
                <div v-if="osceTab === 'diagnostics'">
                  <div v-if="filteredDiagnosticExams.length === 0" class="text-center py-5">
                    <div class="no-data-icon mb-3">
                      <i class="bi bi-clipboard-data" style="font-size: 3.5rem; color: #dee2e6;"></i>
                    </div>
                    <h3 class="mb-3">No Diagnostic Exams Available</h3>
                    <p class="text-muted mb-4">There are currently no diagnostic exams available for your category. Please check back later!</p>
                  </div>
                  
                  <div v-else class="row g-4">
                    <div class="col-md-6" v-for="(exam, index) in filteredDiagnosticExams" :key="`diagnostic-${index}`">
                      <div class="osce-exam-card diagnostic-exam-card" :class="{'taken-exam': hasUserTakenExam(exam.id)}">
                        <div class="exam-status-ribbon" v-if="hasUserTakenExam(exam.id)">
                          <span><i class="bi bi-check-circle-fill"></i> Completed</span>
                        </div>
                        <div class="exam-header">
                          <div class="exam-icon diagnostic-icon" :class="`diagnostic-${exam.diagnostic_type || 'default'}`">
                            <i :class="`bi ${exam.diagnosticTypeIcon || 'bi-clipboard-data'}`"></i>
                          </div>
                          <div class="exam-info">
                            <h3 class="exam-title">{{ exam.title }}</h3>
                            <div class="exam-badges">
                              <span class="badge bg-purple-light text-dark">
                                <i class="bi bi-tag"></i> {{ exam.diagnosticTypeName || 'Diagnostic Exam' }}
                              </span>
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-clock"></i> {{ exam.duration_minutes }} minutes
                              </span>
                              <span class="badge bg-light text-dark">
                                <i class="bi bi-collection"></i> {{ exam.case_count || 0 }} cases
                              </span>
                              <span class="badge bg-light text-dark" v-if="hasUserTakenExam(exam.id || exam.examId)">
                                <i class="bi bi-calendar-check"></i> Last: {{ getLastAttemptDate(exam.id || exam.examId) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-body">
                          <p>{{ exam.description }}</p>
                          
                          <div class="osce-features diagnostic-features">
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Image-based diagnosis</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Clinical interpretation</span>
                            </div>
                            <div class="feature-item">
                              <i class="bi bi-check-circle"></i>
                              <span>Detailed explanations</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="exam-footer">
                          <button 
                            v-if="hasUserTakenExam(exam.id || exam.examId)" 
                            class="btn btn-outline-info me-2" 
                            @click="viewExamResults(exam.id || exam.examId)"
                          >
                            <i class="bi bi-bar-chart-fill me-1"></i> View Results
                          </button>
                          <button 
                            class="btn btn-purple" 
                            @click="handleExamAccess(exam)"
                          >
                            <i class="bi bi-play-fill me-1"></i> {{ hasUserTakenExam(exam.id || exam.examId) ? 'Retake Exam' : 'Start Exam' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Settings Section -->
            <div v-if="activeSection === 'settings'" class="dashboard-section">
              <h2>Settings</h2>
              
              <div class="settings-container">
                <!-- Notification Settings -->
                <div class="settings-card">
                  <div class="settings-header">
                    <div class="settings-icon">
                      <i class="bi bi-bell"></i>
                    </div>
                    <div class="settings-title">
                      <h3>Notification Preferences</h3>
                      <p>Control which notifications you receive and how</p>
                    </div>
                  </div>
                  <div class="settings-body">
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Email Notifications</h4>
                        <p>Receive important updates via email</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="email-notifications" v-model="settings.emailNotifications">
                        <label for="email-notifications"></label>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>WhatsApp Notifications</h4>
                        <p>Get instant notifications on WhatsApp</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="whatsapp-notifications" v-model="settings.whatsappNotifications">
                        <label for="whatsapp-notifications"></label>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Course Reminders</h4>
                        <p>Reminders about upcoming classes and deadlines</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="course-reminders" v-model="settings.courseReminders">
                        <label for="course-reminders"></label>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>New Content Alerts</h4>
                        <p>Be notified when new content is available</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="new-content-alerts" v-model="settings.newContentAlerts">
                        <label for="new-content-alerts"></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Privacy Settings -->
                <div class="settings-card">
                  <div class="settings-header">
                    <div class="settings-icon">
                      <i class="bi bi-shield-lock"></i>
                    </div>
                    <div class="settings-title">
                      <h3>Privacy & Security</h3>
                      <p>Manage your privacy preferences and account security</p>
                    </div>
                  </div>
                  <div class="settings-body">
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Public Profile</h4>
                        <p>Allow other students to see your profile</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="public-profile" v-model="settings.publicProfile">
                        <label for="public-profile"></label>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="two-factor" v-model="settings.twoFactor">
                        <label for="two-factor"></label>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Activity Log</h4>
                        <p>Track and review your account activity</p>
                      </div>
                      <button class="btn btn-outline-primary">View Activity</button>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Data Access</h4>
                        <p>Download your personal data</p>
                      </div>
                      <button class="btn btn-outline-primary">Request Data</button>
                    </div>
                  </div>
                </div>
                
                <!-- Appearance Settings -->
                <div class="settings-card">
                  <div class="settings-header">
                    <div class="settings-icon">
                      <i class="bi bi-palette"></i>
                    </div>
                    <div class="settings-title">
                      <h3>Display & Accessibility</h3>
                      <p>Customize your experience on TutorMed</p>
                    </div>
                  </div>
                  <div class="settings-body">
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Theme Preference</h4>
                        <p>Choose between light and dark mode</p>
                      </div>
                      <div class="theme-toggle">
                        <button class="theme-btn" :class="{ active: settings.theme === 'light' }" @click="changeTheme('light')">
                          <i class="bi bi-sun"></i> Light
                        </button>
                        <button class="theme-btn" :class="{ active: settings.theme === 'dark' }" @click="changeTheme('dark')">
                          <i class="bi bi-moon"></i> Dark
                        </button>
                        <button class="theme-btn" :class="{ active: settings.theme === 'system' }" @click="changeTheme('system')">
                          <i class="bi bi-laptop"></i> System
                        </button>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Font Size</h4>
                        <p>Adjust the text size for better readability</p>
                      </div>
                      <div class="font-size-selector">
                        <button class="font-size-btn" :class="{ active: settings.fontSize === 'small' }" @click="changeFontSize('small')">A</button>
                        <button class="font-size-btn" :class="{ active: settings.fontSize === 'medium' }" @click="changeFontSize('medium')">A</button>
                        <button class="font-size-btn" :class="{ active: settings.fontSize === 'large' }" @click="changeFontSize('large')">A</button>
                      </div>
                    </div>
                    
                    <div class="settings-item">
                      <div class="settings-item-info">
                        <h4>Animations</h4>
                        <p>Enable or disable interface animations</p>
                      </div>
                      <div class="toggle-switch">
                        <input type="checkbox" id="animations" v-model="settings.animations" @change="applyAnimations(settings.animations)">
                        <label for="animations"></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Subscription Settings -->
                <div class="settings-card">
                  <div class="settings-header">
                    <div class="settings-icon subscription-icon">
                      <i class="bi bi-credit-card"></i>
                    </div>
                    <div class="settings-title">
                      <h3>Subscription Management</h3>
                      <p>View and manage your TutorMed subscription</p>
                    </div>
                    <div class="subscription-badge">
                      <span>Premium</span>
                    </div>
                  </div>
                  <div class="settings-body">
                    <div class="subscription-info">
                      <div class="subscription-details">
                        <div class="subscription-type">Premium {{ userCategoryName }} Plan</div>
                        <div class="subscription-period">Annual Subscription</div>
                        <div class="subscription-date">Renews on June 30, 2025</div>
                      </div>
                      <div class="subscription-price">
                        <div class="amount">₵999.99</div>
                        <div class="period">/year</div>
                      </div>
                    </div>
                    
                    <div class="subscription-features">
                      <div class="feature-item">
                        <i class="bi bi-check-circle"></i>
                        <span>Unlimited access to all courses</span>
                      </div>
                      <div class="feature-item">
                        <i class="bi bi-check-circle"></i>
                        <span>Personalized study plans</span>
                      </div>
                      <div class="feature-item">
                        <i class="bi bi-check-circle"></i>
                        <span>Unlimited mock exams</span>
                      </div>
                      <div class="feature-item">
                        <i class="bi bi-check-circle"></i>
                        <span>Priority support</span>
                      </div>
                    </div>
                    
                    <div class="subscription-actions">
                      <button class="btn btn-outline-primary">Manage Subscription</button>
                      <button class="btn btn-outline-danger">Cancel Subscription</button>
                    </div>
                  </div>
                </div>
                
                <div class="settings-actions">
                  <button class="btn btn-primary" @click="saveSettings">Save Settings</button>
                </div>
              </div>
            </div><!-- End Settings -->
            
          </div><!-- End Main Content -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- Exam Results Modal -->
  <div class="modal fade" :class="{ 'show d-block': showExamResultsModal }" 
       tabindex="-1" role="dialog" aria-hidden="true"
       v-if="showExamResultsModal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header exam-results-header">
          <h5 class="modal-title">
            <i class="bi bi-graph-up"></i> 
            Exam Results: {{ examResultsData.exam.title }}
          </h5>
          <button type="button" class="btn-close" @click="closeExamResultsModal"></button>
        </div>
        <div class="modal-body">
          <div class="results-summary">
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="result-stat" :class="{ 'good': examResultsData.highestScore >= (examResultsData.exam.passmark || 60) }">
                  <div class="stat-label">Highest Score</div>
                  <div class="stat-value">{{ examResultsData.highestScore }}%</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="result-stat" :class="{ 'good': examResultsData.averageScore >= (examResultsData.exam.passmark || 60) }">
                  <div class="stat-label">Average Score</div>
                  <div class="stat-value">{{ examResultsData.averageScore }}%</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="result-stat" :class="{ 'good': examResultsData.passRate > 50 }">
                  <div class="stat-label">Pass Rate</div>
                  <div class="stat-value">{{ examResultsData.passRate }}%</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="result-stat attempts">
                  <div class="stat-label">Attempts</div>
                  <div class="stat-value">{{ examResultsData.attempts.length }}</div>
                </div>
              </div>
            </div>
            
            <div class="performance-trend mb-4">
              <h6 class="trend-label">Performance Trend:</h6>
              <div class="trend-value">
                <span v-if="examResultsData.trend === 'improving'" class="improving">
                  <i class="bi bi-graph-up-arrow"></i> Improving
                </span>
                <span v-else-if="examResultsData.trend === 'declining'" class="declining">
                  <i class="bi bi-graph-down-arrow"></i> Declining
                </span>
                <span v-else-if="examResultsData.trend === 'consistent'" class="consistent">
                  <i class="bi bi-dash"></i> Consistent
                </span>
                <span v-else class="new">
                  <i class="bi bi-star"></i> First Attempt
                </span>
              </div>
            </div>
            
            <div class="improvement-advice mb-4">
              <h6><i class="bi bi-lightbulb"></i> Personalized Advice</h6>
              <ul class="advice-list">
                <li v-for="(advice, index) in examResultsData.advice" :key="`advice-${index}`">
                  {{ advice }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="results-detail">
            <h6 class="detail-title">Attempt History</h6>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Time Taken</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(attempt, index) in examResultsData.attempts" :key="`attempt-${index}`" 
                      :class="{ 'table-success': attempt.passed, 'table-danger': !attempt.passed }">
                    <td>{{ attempt.date }}</td>
                    <td><strong>{{ attempt.score }}%</strong></td>
                    <td>{{ attempt.correctAnswers }} / {{ examResultsData.totalQuestions }}</td>
                    <td>{{ attempt.timeTaken }}</td>
                    <td>
                      <span class="badge" :class="attempt.passed ? 'bg-success' : 'bg-danger'">
                        {{ attempt.passed ? 'PASSED' : 'FAILED' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeExamResultsModal">Close</button>
          <button 
            @click="retakeExamFromResults(examResultsData.exam)"
            class="btn btn-warning">
            <i class="bi bi-arrow-repeat me-1"></i> Retake Exam
          </button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop show" @click="closeExamResultsModal"></div>
  </div>
  
  <!-- Course Access Verification Modal -->
  <CourseAccessVerification
    :show="showFaceVerification"
    :verification-type="faceVerificationType"
    :redirect-data="faceRedirectData"
    @verified="handleFaceVerified"
    @close="showFaceVerification = false"
    @error="handleFaceError"
  />
</template>

<script>
import api from '@/services/api';
import { ExamAttemptTracker } from '@/components/exam/ExamAttemptTracker';
import CourseAccessVerification from '@/components/CourseAccessVerification.vue';

export default {
  name: 'Dashboard',
  components: {
    CourseAccessVerification
  },
  mixins: [ExamAttemptTracker],
  props: {
    initialSection: {
      type: String,
      default: 'overview'
    }
  },
  computed: {
    userFirstName() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return userData.first_name || userData.firstName || 'Student';
    },
    userFullName() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const firstName = userData.first_name || userData.firstName || '';
      const lastName = userData.last_name || userData.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'User';
    },
    filteredAndSearchedExams() {
      if (!this.filteredMockExams || !Array.isArray(this.filteredMockExams)) return [];
      
      // First apply type filter if set
      let filteredByType = this.filteredMockExams;
      if (this.examTypeFilter) {
        filteredByType = this.filteredMockExams.filter(exam => {
          const examType = (exam.examType || exam.type || '').toLowerCase();
          return examType === this.examTypeFilter.toLowerCase();
        });
      }
      
      // Then apply search query if set
      if (!this.examSearchQuery || this.examSearchQuery.trim() === '') {
        return filteredByType;
      }
      
      const searchQuery = this.examSearchQuery.toLowerCase().trim();
      return filteredByType.filter(exam => {
        // Search in title
        if (exam.title && exam.title.toLowerCase().includes(searchQuery)) return true;
        
        // Search in description
        if (exam.description && exam.description.toLowerCase().includes(searchQuery)) return true;
        
        // Get keywords and search in them
        const keywords = this.getExamKeywords(exam);
        for (const keyword of keywords) {
          if (keyword.toLowerCase().includes(searchQuery)) return true;
        }
        
        return false;
      });
    },
    userCategory() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.category) return 'Student';
      const categoryMap = {
        '1': 'Nurse',
        '2': 'Physician Assistant',
        '3': 'Medical Student',
        '4': 'Doctor',
        '5': 'Foreign Exam Candidate',
        'nurse': 'Nurse',
        'physician-assistant': 'Physician Assistant',
        'medical-student': 'Medical Student',
        'doctor': 'Doctor',
        'foreign-exam': 'Foreign Exam Candidate'
      };
      return categoryMap[userData.category] || 'Student';
    },
    userCategoryName() {
      const map = {
        '1': 'Nurse',
        '2': 'PA',
        '3': 'Student',
        '4': 'Doctor',
        '5': 'Exam',
        'nurse': 'Nurse',
        'physician-assistant': 'PA',
        'medical-student': 'Student',
        'doctor': 'Doctor',
        'foreign-exam': 'Exam'
      };
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return map[userData.category] || 'Student';
    },
    displayedActivities() {
      return this.isViewingAllActivities ? this.recentActivities : this.recentActivities.slice(0, 5);
    },
    filteredDiagnosticExams() {
      if (!this.diagnosticExams || this.diagnosticExams.length === 0) return [];
      
      // Get user's subcategory from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userSubcategory = userData.subcategory || userData.user_subcategory;
      console.log('Filtering diagnostic exams for user subcategory:', userSubcategory);
      
      return this.diagnosticExams.filter(exam => {
        // Check the target_subcategories field (subcategory-based)
        if (exam.target_subcategories) {
          let targetSubcategories = [];
          try {
            targetSubcategories = typeof exam.target_subcategories === 'string' 
              ? JSON.parse(exam.target_subcategories) 
              : Array.isArray(exam.target_subcategories) 
                ? exam.target_subcategories 
                : [];
          } catch (e) {
            console.error('Error parsing target_subcategories:', e);
          }
          
          // Check if exam is for all users or specifically includes this user's subcategory
          const isForAll = targetSubcategories.includes('all');
          if (userSubcategory && (isForAll || targetSubcategories.includes(userSubcategory))) {
            return true;
          }
          
          // If target_subcategories is set but doesn't include user's subcategory (and not "all"), skip other checks
          if (targetSubcategories.length > 0 && !isForAll) {
            return false;
          }
        }
        
        // Fall back to old category-based logic for backward compatibility
        const categoryIdToString = {
          1: 'nurse',
          2: 'pa',
          3: 'student',
          4: 'doctor',
          5: 'foreign'
        };
        const userCategory = categoryIdToString[this.userCategoryId] || null;
        
        if (exam.user_category) {
          if (exam.user_category === 'all') return true;
          if (userCategory && exam.user_category === userCategory) return true;
        }
        
        return false;
      });
    },
    
    filteredMockExams() {
      if (this.isLoadingExams || !this.mockExams || this.mockExams.length === 0) return [];
      
      // Helper function to check if an exam is not OSCE type (moved inside computed property to avoid scope issues)
      const isNotOsceExam = (exam) => {
        const examType = (exam.examType || exam.type || exam.exam_type || '').toLowerCase();
        // Filter out both OSCE and DIAGNOSTIC exams from the mock exams list
        return examType !== 'osce' && examType !== 'diagnostic' && examType !== 'diag';
      };
      
      // Get user's subcategory from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userSubcategory = userData.subcategory;
      
      console.log('\n=== FILTERING MOCK EXAMS ===');
      console.log('User subcategory:', userSubcategory);
      
      if (!this.userCategoryId) {
        return this.mockExams.filter(exam => 
          (exam.user_category === 'all' || exam.userCategory === 'all' || !exam.user_category) && 
          isNotOsceExam(exam)
        );
      }
      const categoryIdToString = {
        1: 'nurse',
        2: 'pa',
        3: 'student',
        4: 'doctor',
        5: 'foreign'
      };
      const userCategory = categoryIdToString[this.userCategoryId] || null;
      console.log('Filtering exams for user category:', userCategory, 'user ID:', this.userCategoryId);
      console.log('Total exams to filter:', this.mockExams.length);
      
      let filtered = this.mockExams.filter(exam => {
        console.log(`\nChecking exam: ${exam.title} (ID: ${exam.id})`);
        console.log(`  Type: ${exam.exam_type || exam.type || exam.examType}`);
        console.log(`  Target subcategories:`, exam.target_subcategories);
        
        // First filter out OSCE and DIAGNOSTIC exams - they appear in their own sections
        if (!isNotOsceExam(exam)) {
          console.log(`  -> EXCLUDED: Not an MCQ exam`);
          return false;
        }
        
        // If user has no subcategory, check old category-based filtering
        if (!userSubcategory) {
          console.log(`Exam "${exam.title}": User has no subcategory, checking if exam is for all or matches category`);
          
          // Check old category fields
          if (exam.user_category === 'all' || !exam.target_subcategories) {
            return true;
          }
          
          // Fall back to category-based filtering
          const categoryMap = {
            1: 'nurse',
            2: 'pa',
            3: 'student',
            4: 'doctor',
            5: 'foreign'
          };
          const userCategoryString = categoryMap[this.userCategoryId];
          if (exam.user_category === userCategoryString) {
            return true;
          }
          
          return false;
        }
        
        // Check the target_subcategories field
        if (exam.target_subcategories) {
          let targetSubcategories = [];
          try {
            targetSubcategories = typeof exam.target_subcategories === 'string' 
              ? JSON.parse(exam.target_subcategories) 
              : Array.isArray(exam.target_subcategories) 
                ? exam.target_subcategories 
                : [];
          } catch (e) {
            console.error(`Error parsing target_subcategories for exam "${exam.title}":`, e);
            return false;
          }
          
          // Check if exam is for all users or specifically includes this user's subcategory
          console.log(`  Checking subcategories:`, targetSubcategories);
          console.log(`  User subcategory:`, userSubcategory);
          
          const isForAll = targetSubcategories.includes('all');
          console.log(`  Is for all?`, isForAll);
          
          const includesUserSubcategory = targetSubcategories.includes(userSubcategory);
          console.log(`  Includes user subcategory?`, includesUserSubcategory);
          
          const isIncluded = isForAll || includesUserSubcategory;
          console.log(`  Final decision: ${isIncluded ? 'INCLUDED' : 'EXCLUDED'}`);
          
          return isIncluded;
        }
        
        // Fall back to old category-based logic for backward compatibility
        if (exam.user_category) {
          if (exam.user_category === 'all') return true;
          if (userCategory && exam.user_category === userCategory) return true;
        }
        if (exam.userCategory) {
          if (exam.userCategory === 'all') return true;
          if (userCategory && exam.userCategory === userCategory) return true;
        }
        if (Array.isArray(exam.userCategories)) {
          return exam.userCategories.includes(this.userCategoryId);
        }
        return false;
      });
      console.log(`Found ${filtered.length} exams for subcategory ${userSubcategory} (category ${userCategory}) out of ${this.mockExams.length} total`);
      
      // Debug summary
      console.log('==== EXAM FILTERING SUMMARY ====');
      console.log('User Info:');
      console.log('- Category ID:', this.userCategoryId);
      console.log('- Category Name:', userCategory);
      console.log('- Subcategory:', userSubcategory);
      console.log('Exam Summary:');
      this.mockExams.forEach((exam, index) => {
        console.log(`Exam ${index + 1}: ${exam.title}`);
        console.log('  - Type:', exam.exam_type || exam.type);
        console.log('  - Target Subcategories:', exam.target_subcategories);
        console.log('  - User Category:', exam.user_category);
        console.log('  - Included:', filtered.includes(exam) ? 'YES' : 'NO');
      });
      console.log('================================');
      if (this.userCategoryId === 3 && this.osceOnly) {
        filtered = filtered.filter(exam => {
          const examType = exam.examType || exam.type || exam.exam_type;
          return examType?.toLowerCase() !== 'mcq';
        });
      }
      filtered = filtered.map(exam => {
        const processedExam = { ...exam };
        processedExam.userCategory = processedExam.user_category || processedExam.userCategory || 'all';
        if (!processedExam.link || typeof processedExam.link !== 'string' || !processedExam.link.trim()) {
          processedExam.link = '/exams/mock-exam';
        }
        if (processedExam.duration_minutes) {
          processedExam.duration = `${processedExam.duration_minutes} mins`;
        } else if (typeof processedExam.duration === 'number') {
          processedExam.duration = `${processedExam.duration} mins`;
        } else if (!processedExam.duration) {
          processedExam.duration = '120 mins';
        }
        if (!processedExam.questions) {
          processedExam.questions = processedExam.questionCount || processedExam.question_count || 0;
        }
        if (!processedExam.icon) {
          const type = (processedExam.type || processedExam.exam_type || '').toLowerCase();
          processedExam.icon = type === 'osce' ? 'bi bi-clipboard-pulse' : 'bi bi-list-check';
        }
        if (!processedExam.examType) {
          processedExam.examType = (processedExam.type || processedExam.exam_type || 'MCQ').toLowerCase();
        }
        if (!processedExam.examId && processedExam.id) {
          processedExam.examId = processedExam.id;
        }
        if (!processedExam.title && processedExam.name) {
          processedExam.title = processedExam.name;
        }
        if (!processedExam.description) {
          processedExam.description = `${processedExam.title || 'Mock Exam'} for ${processedExam.userCategory} category`;
        }
        return processedExam;
      });
      return filtered;
    },
    
    // Note: isNotOsceExam method was moved inside filteredMockExams computed property
    
    // Get the last attempt date for an exam
    getLastAttemptDate(examId) {
      if (!examId || !this.completedExams || !this.completedExams[examId]) return 'Unknown';
      
      const attempts = this.completedExams[examId];
      if (!attempts || attempts.length === 0) return 'Unknown';
      
      // Sort attempts by date (newest first)
      const sortedAttempts = [...attempts].sort((a, b) => {
        const dateA = a.completed_at || a.started_at;
        const dateB = b.completed_at || b.started_at;
        return new Date(dateB) - new Date(dateA);
      });
      
      // Get date of most recent attempt
      const latestAttempt = sortedAttempts[0];
      const attemptDate = latestAttempt.completed_at || latestAttempt.started_at;
      
      if (!attemptDate) return 'Unknown';
      
      // Format the date
      const date = new Date(attemptDate);
      return date.toLocaleDateString();
    },
    subscriptionStatusClass() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.subscription_end_date) {
        // Check if user has payment_verified but no subscription dates (bug case)
        if (userData.payment_verified && userData.status === 'active') {
          return 'bg-info'; // Blue for "needs setup"
        }
        return 'bg-warning'; // Yellow for "no subscription"
      }
      
      const subscriptionDate = new Date(userData.subscription_end_date);
      const now = new Date();
      
      if (subscriptionDate < now) {
        return 'bg-danger';
      } else {
        return 'bg-success';
      }
    },
    subscriptionStatusText() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.subscription_end_date) {
        // Check if user has payment_verified but no subscription dates (bug case)
        if (userData.payment_verified && userData.status === 'active') {
          return 'Setup Required';
        }
        return 'No Subscription';
      }
      
      const subscriptionDate = new Date(userData.subscription_end_date);
      const now = new Date();
      
      if (subscriptionDate < now) {
        return 'Expired';
      } else {
        return 'Active';
      }
    },
    subscriptionStatusMessage() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.subscription_end_date) {
        // Check if user has payment_verified but no subscription dates (bug case)
        if (userData.payment_verified && userData.status === 'active') {
          return 'Subscription dates need to be set up. Please contact support.';
        }
        return 'No active subscription found';
      }
      
      const subscriptionEndDate = new Date(userData.subscription_end_date);
      const now = new Date();
      const daysRemaining = Math.ceil((subscriptionEndDate - now) / (1000 * 60 * 60 * 24));
      
      if (subscriptionEndDate < now) {
        return `Expired on: ${this.profileData.subscriptionEnd}`;
      } else {
        let message = `Valid until: ${this.profileData.subscriptionEnd}`;
        
        // Add days remaining for active subscriptions
        if (daysRemaining > 0) {
          message += ` (${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining)`;
        }
        
        // Add subscription period info if start date is available
        if (this.profileData.subscriptionStart) {
          const paymentOption = userData.payment_option || 'monthly';
          message += ` • ${paymentOption.charAt(0).toUpperCase() + paymentOption.slice(1)} plan`;
        }
        
        return message;
      }
    },
    isCurrentlyVerified() {
      // Check if user has recent face verification
      if (!this.lastVerificationTime) {
        console.log('Face verification: No lastVerificationTime');
        return false;
      }
      
      const now = new Date();
      const lastVerified = new Date(this.lastVerificationTime);
      const hoursSinceVerification = (now - lastVerified) / (1000 * 60 * 60);
      
      console.log('Face verification status:', {
        lastVerificationTime: this.lastVerificationTime,
        hoursSinceVerification,
        isVerified: hoursSinceVerification < 24
      });
      
      // Consider verified if within 24 hours
      return hoursSinceVerification < 24;
    }
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User data from localStorage:', userData);
    console.log('User subcategory:', userData.subcategory);
    
    // Check subscription status immediately
    const userRole = userData.role_details?.name || 
                    (userData.role && typeof userData.role === 'object' ? userData.role.name : userData.role);
    
    // Skip subscription check for admin users
    if (userRole !== 'admin') {
      if (!userData.subscription_end_date) {
        console.log('No subscription end date found, redirecting to pricing');
        this.$router.push('/pricing?reason=no_subscription');
        return;
      }
      
      const subscriptionEndDate = new Date(userData.subscription_end_date);
      const now = new Date();
      
      if (subscriptionEndDate <= now) {
        console.log('Subscription has expired, redirecting to pricing');
        this.$router.push('/pricing?reason=subscription_expired');
        return;
      }
    }
    
    this.profileData.firstName = userData.first_name || userData.firstName || '';
    this.profileData.lastName = userData.last_name || userData.lastName || '';
    this.profileData.email = userData.email || '';
    this.profileData.whatsapp = userData.whatsapp_number || userData.whatsapp || '';
    
    // Load subscription dates
    if (userData.subscription_end_date) {
      const subscriptionEndDate = new Date(userData.subscription_end_date);
      this.profileData.subscriptionEnd = subscriptionEndDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      this.profileData.subscriptionEnd = 'No active subscription';
    }
    
    // Load subscription start date if available
    if (userData.subscription_start_date) {
      const subscriptionStartDate = new Date(userData.subscription_start_date);
      this.profileData.subscriptionStart = subscriptionStartDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      this.profileData.subscriptionStart = null;
    }
    if (userData && 'osce_only' in userData) {
      this.osceOnly = userData.osce_only === true;
    }
    if (userData.category) {
      if (!isNaN(parseInt(userData.category))) {
        const categoryId = parseInt(userData.category);
        this.userCategoryId = categoryId;
        const categoryIdToString = {
          1: 'nurse',
          2: 'physician-assistant',
          3: 'medical-student',
          4: 'doctor',
          5: 'foreign-exam'
        };
        this.profileData.category = categoryIdToString[categoryId] || '';
        console.log(`Mapped category ID ${categoryId} to ${this.profileData.category}`);
      } else {
        this.profileData.category = userData.category;
        const categoryStringToId = {
          'nurse': 1,
          'physician-assistant': 2,
          'medical-student': 3,
          'doctor': 4,
          'foreign-exam': 5
        };
        this.userCategoryId = categoryStringToId[userData.category] || null;
      }
    } else {
      this.profileData.category = '';
    }
    this.setProfileImageUrl();
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsedSettings };
        this.applyTheme(this.settings.theme);
        this.applyFontSize(this.settings.fontSize);
        this.applyAnimations(this.settings.animations);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    } else {
      this.applyTheme(this.settings.theme);
      this.applyFontSize(this.settings.fontSize);
      this.applyAnimations(this.settings.animations);
    }
    if (this.initialSection) {
      this.activeSection = this.initialSection;
    }
    this.isLoadingActivities = true;
    this.loadUserActivities();
    this.fetchUserCourses();
    this.fetchMockExams();
    this.fetchOsceExams();
    this.activityUpdateInterval = setInterval(() => {
      this.updateActivityTimes();
    }, 60000);
    this.addUserActivity({
      type: 'dashboard_viewed',
      title: 'Viewed dashboard',
      timestamp: Date.now(),
      color: 'info'
    });
    setTimeout(() => {
      this.isLoadingActivities = false;
    }, 800);
    this.setupActivityTracking();
    
    // Initialize face verification check
    this.checkFaceVerificationStatus();
  },
  beforeUnmount() {
    if (this.activityUpdateInterval) {
      clearInterval(this.activityUpdateInterval);
    }
  },
  data() {
    return {
      activeSection: 'overview',
      profileImageUrl: null,
      userCategoryId: null,
      osceOnly: false,
      isLoadingCourses: false,
      isLoadingExams: false,
      isLoadingOsceExams: false,
      isLoadingActivities: false,
      isViewingAllActivities: false,
      examSearchQuery: '',
      examTypeFilter: '',
      completedExams: {},
      osceExams: [],
      unmannedOsceExams: [],
      mannedOsceExams: [],
      diagnosticExams: [],
      osceTab: 'unmanned',
      showExamResultsModal: false,
      examResultsData: {
        exam: {},
        attempts: [],
        highestScore: 0,
        lowestScore: 0,
        averageScore: 0,
        passRate: 0,
        trend: 'new',
        advice: []
      },
      settings: {
        emailNotifications: true,
        whatsappNotifications: true,
        courseReminders: true,
        newContentAlerts: true,
        publicProfile: false,
        twoFactor: false,
        theme: 'light',
        fontSize: 'medium',
        animations: true
      },
      // Face verification data
      showFaceVerification: false,
      faceVerificationMode: 'verification',
      faceVerificationType: 'course_access',
      faceRedirectData: null,
      hasFaceData: false,
      faceVerificationRequired: true,
      lastVerificationTime: null,
      verificationSessionId: null,
      isCheckingFaceStatus: true,
      
      menuItems: [
        { label: 'Dashboard', value: 'overview', icon: 'bi bi-speedometer2' },
        { label: 'My Courses', value: 'courses', icon: 'bi bi-book' },
        { label: 'Mock Exams', value: 'mocks', icon: 'bi bi-clipboard-check' },
        { label: 'OSCE Practice', value: 'osce', icon: 'bi bi-clipboard-pulse' },
        { label: 'Profile', value: 'profile', icon: 'bi bi-person' },
        { label: 'Settings', value: 'settings', icon: 'bi bi-gear' }
      ],
      statsData: [
        { label: 'Courses', value: '4', icon: 'bi bi-book' },
        { label: 'Completed', value: '2', icon: 'bi bi-check-circle' },
        { label: 'In Progress', value: '2', icon: 'bi bi-hourglass-split' }
      ],
      recentActivities: [],
      activityUpdateInterval: null,
      upcomingClasses: [
        {
          day: '-',
          month: 'TBA',
          title: 'Clinical Diagnosis Techniques',
          time: '10:00 AM - 12:00 PM',
          instructor: 'TBA'
        },
        {
          day: '-',
          month: 'TBA',
          title: 'OSCE Mock Examination',
          time: '2:00 PM - 5:00 PM',
          instructor: 'TBA'
        }
      ],
      myCourses: [
        {
          id: 1,
          title: 'Basic Sciences',
          description: 'Anatomy, Biochemistry, Physiology, and more.',
          image: require('@/assets/course-placeholder.jpg'),
          progress: 75,
          link: '/courses/basic-sciences'
        },
        {
          id: 2,
          title: 'Clinical Sciences',
          description: 'Internal Medicine, Surgery, OBGYN, and Pediatrics.',
          image: require('@/assets/course-placeholder.jpg'),
          progress: 45,
          link: '/courses/clinical-sciences'
        },
        {
          id: 3,
          title: 'OSCE Preparation',
          description: 'History taking, physical examination, and procedures.',
          image: require('@/assets/course-placeholder.jpg'),
          progress: 60,
          link: '/courses/osce'
        },
        {
          id: 4,
          title: 'MCQ Practice',
          description: 'Multiple choice questions for comprehensive exam preparation.',
          image: require('@/assets/course-placeholder.jpg'),
          progress: 30,
          link: '/courses/mcq'
        }
      ],
      mockExams: [
        {
          title: 'MCQ Mock Exam (Basic Sciences)',
          description: 'Test your knowledge of basic medical sciences.',
          duration: '2 hours',
          questions: 100,
          icon: 'bi bi-file-earmark-text',
          link: '/exams/mock-exam',
          examType: 'mcq',
          examId: 1,
          userCategories: [3, 4]
        },
        {
          title: 'OSCE Mock Exam',
          description: 'Practice your clinical examination skills.',
          duration: '3 hours',
          questions: 12,
          icon: 'bi bi-clipboard-plus',
          link: '/exams/mock-exam',
          examType: 'osce',
          examId: 2,
          userCategories: [3]
        },
        {
          title: 'Clinical Sciences Mock',
          description: 'Test your clinical knowledge and diagnostic skills.',
          duration: '2.5 hours',
          questions: 150,
          icon: 'bi bi-file-medical',
          link: '/exams/mock-exam',
          examType: 'mcq',
          examId: 3,
          userCategories: [3, 4]
        },
        {
          title: 'GMDC Preparation',
          description: 'Practice with previous GMDC examination questions.',
          duration: '3 hours',
          questions: 200,
          icon: 'bi bi-journal-check',
          link: '/exams/mock-exam',
          examType: 'mcq',
          examId: 4,
          userCategories: [3, 4]
        },
        {
          title: 'Nursing Skills Assessment',
          description: 'Test your knowledge of nursing procedures and patient care.',
          duration: '2 hours',
          questions: 100,
          icon: 'bi bi-file-earmark-text',
          link: '/exams/mock-exam',
          examType: 'nursing',
          examId: 5,
          userCategories: [1]
        },
        {
          title: 'Physician Assistant Mock',
          description: 'Practice your clinical decision making and procedural skills.',
          duration: '2.5 hours',
          questions: 120,
          icon: 'bi bi-clipboard-medical',
          link: '/exams/mock-exam',
          examType: 'pa',
          examId: 6,
          userCategories: [2]
        }
      ],
      profileData: {
        firstName: '',
        lastName: '',
        email: '',
        whatsapp: '',
        category: '',
        subscriptionStart: null,
        subscriptionEnd: null
      },
      passwordData: {
        current: '',
        new: '',
        confirm: ''
      }
    };
  },
  methods: {
    // Face Verification Methods
    async checkFaceVerificationStatus() {
      try {
        this.isCheckingFaceStatus = true;
        console.log('Checking face verification status...');
        const response = await api.checkFaceDataExists();
        console.log('Face verification response:', response.data);
        this.hasFaceData = response.data.has_face_data;
        this.faceVerificationRequired = response.data.verification_required;
        this.lastVerificationTime = response.data.last_verification;
        
        // Check if verification is needed (e.g., if last verification was more than 24 hours ago)
        if (this.faceVerificationRequired && this.lastVerificationTime) {
          const lastVerified = new Date(this.lastVerificationTime);
          const now = new Date();
          const hoursSinceVerification = (now - lastVerified) / (1000 * 60 * 60);
          
          // Require re-verification every 24 hours
          if (hoursSinceVerification > 24) {
            this.faceVerificationRequired = true;
          }
        }
      } catch (error) {
        console.error('Error checking face verification status:', error);
      } finally {
        this.isCheckingFaceStatus = false;
      }
    },
    
    async handleCourseAccess(course) {
      // Store the course data for redirect after verification
      this.faceRedirectData = {
        type: 'course',
        courseId: course.id,
        courseName: course.title
      };
      
      // Check if face verification is required
      if (this.faceVerificationRequired && this.hasFaceData) {
        this.faceVerificationType = 'course_access';
        this.faceVerificationMode = 'verification';
        this.showFaceVerification = true;
      } else if (!this.hasFaceData) {
        // No face data registered, prompt for registration
        this.$router.push({
          name: 'Profile',
          query: { setupFace: true }
        });
      } else {
        // Verification not required, proceed to course
        this.navigateToCourse(course.id);
      }
    },
    
    async handleExamAccess(exam) {
      // Determine the correct exam type
      let examType = 'MCQ'; // default
      if (exam.station_details || exam.manned_station) {
        examType = 'MANNED_OSCE';
      } else if (exam.diagnostic_type || exam.examType === 'diagnostic') {
        examType = 'DIAGNOSTIC';
      } else if (exam.station_type || exam.station_count !== undefined || exam.default_minutes_per_station !== undefined) {
        // Unmanned OSCE exam (identified by OSCE-specific fields)
        examType = 'OSCE';
      } else if (exam.examType === 'OSCE' || exam.type === 'OSCE') {
        examType = 'OSCE';
      } else if (exam.examType) {
        examType = exam.examType;
      } else if (exam.type) {
        examType = exam.type;
      }
      
      console.log('Exam type detection for exam:', exam.title || exam.id, {
        station_type: exam.station_type,
        station_count: exam.station_count,
        default_minutes_per_station: exam.default_minutes_per_station,
        examType: exam.examType,
        type: exam.type,
        detected_type: examType
      });
      
      // Store the exam data for redirect after verification
      this.faceRedirectData = {
        type: 'exam',
        examId: exam.id || exam.examId,
        examType: examType,
        examName: exam.title,
        examData: exam // Store full exam data for routing
      };
      
      // Check if face verification is required
      if (this.faceVerificationRequired && this.hasFaceData) {
        this.faceVerificationType = 'exam_access';
        this.faceVerificationMode = 'verification';
        this.showFaceVerification = true;
      } else if (!this.hasFaceData) {
        // No face data registered, prompt for registration
        this.$router.push({
          name: 'Profile',
          query: { setupFace: true }
        });
      } else {
        // Verification not required, proceed to exam
        this.navigateToExam(exam.id || exam.examId, examType, exam);
      }
    },
    
    retakeExamFromResults(examData) {
      // Close the results modal first
      this.closeExamResultsModal();
      
      // Use the same logic as handleExamAccess to ensure proper routing
      this.handleExamAccess({
        id: examData.examId,
        examId: examData.examId,
        title: examData.title,
        examType: examData.examType,
        type: examData.examType
      });
    },
    
    navigateToCourse(courseId) {
      this.$router.push({
        name: 'CourseDetails',
        params: { id: courseId }
      });
    },
    
    navigateToExam(examId, examType, examData = null) {
      // Add user activity tracking
      if (examData) {
        this.addUserActivity({
          type: 'exam_started',
          title: `Started a ${examType} exam`,
          timestamp: Date.now(),
          courseName: examData.title,
          courseId: examId,
          examType: examType,
          icon: this.getExamIcon(examType),
          color: this.getExamColor(examType)
        });
      }
      
      // Route based on exam type
      if (examType === 'OSCE') {
        // For unmanned OSCE, route to dedicated page with face verification parameter
        this.$router.push({
          path: `/mock-exams/osce/${examId}`,
          query: { 
            faceVerified: this.verificationSessionId ? 'true' : 'false',
            fromDashboard: 'true'
          }
        });
      } else if (examType === 'MANNED_OSCE') {
        this.$router.push({
          path: '/exams/manned-osce',
          query: { 
            stationId: examId,
            examId: examData?.station_details?.exam?.id
          }
        });
      } else if (examType === 'DIAGNOSTIC') {
        if (examData?.url) {
          this.$router.push(examData.url);
        } else {
          this.$router.push({
            path: `/exams/diagnostic-exam/${examId}`,
          });
        }
      } else {
        // For MCQ and other exam types
        this.$router.push({
          path: '/exams/mock-exam',
          query: { id: examId, type: examType || 'MCQ' }
        });
      }
    },
    
    getExamIcon(examType) {
      const iconMap = {
        'OSCE': 'bi bi-clipboard-pulse',
        'MANNED_OSCE': 'bi bi-person-video3',
        'DIAGNOSTIC': 'bi bi-clipboard-data',
        'MCQ': 'bi bi-list-check'
      };
      return iconMap[examType] || 'bi bi-clipboard';
    },
    
    getExamColor(examType) {
      const colorMap = {
        'OSCE': 'warning',
        'MANNED_OSCE': 'info',
        'DIAGNOSTIC': 'purple',
        'MCQ': 'primary'
      };
      return colorMap[examType] || 'primary';
    },
    
    handleFaceVerified(data) {
      console.log('Face verification successful:', data);
      this.verificationSessionId = data.sessionId;
      this.showFaceVerification = false;
      
      // Update last verification time
      this.lastVerificationTime = new Date().toISOString();
      
      // Navigate based on redirect data
      if (this.faceRedirectData) {
        if (this.faceRedirectData.type === 'course') {
          this.navigateToCourse(this.faceRedirectData.courseId);
        } else if (this.faceRedirectData.type === 'courses') {
          // For general courses access, just update verification time
          // Courses will now be visible due to isCurrentlyVerified computed property
          console.log('Face verification complete - courses now accessible');
        } else if (this.faceRedirectData.type === 'exam') {
          this.navigateToExam(
            this.faceRedirectData.examId, 
            this.faceRedirectData.examType,
            this.faceRedirectData.examData
          );
        }
      }
      
      // Clear redirect data
      this.faceRedirectData = null;
    },
    
    handleFaceSkipped() {
      console.log('Face verification skipped');
      this.showFaceVerification = false;
      
      // For now, allow access even if skipped (you can change this policy)
      if (this.faceRedirectData) {
        if (this.faceRedirectData.type === 'course') {
          this.navigateToCourse(this.faceRedirectData.courseId);
        }
      }
      
      // Clear redirect data
      this.faceRedirectData = null;
    },
    
    handleFaceError(error) {
      console.error('Face verification error:', error);
      
      // Show error message to user
      let message = 'Face verification failed. ';
      if (error.type === 'camera_access') {
        message += 'Please allow camera access to continue.';
      } else if (error.type === 'no_face_detected') {
        message += 'No face was detected. Please ensure your face is clearly visible.';
      } else if (error.type === 'multiple_faces') {
        message += 'Multiple faces detected. Please ensure only you are in the frame.';
      } else {
        message += 'Please try again or contact support if the issue persists.';
      }
      
      alert(message); // Replace with better notification system
      
      // Don't allow access on error
      this.showFaceVerification = false;
      this.faceRedirectData = null;
    },
    
    // Face verification for courses access
    triggerFaceVerificationForCourses() {
      // Set verification type for courses
      this.faceVerificationType = 'course_access';
      this.faceVerificationMode = 'verification';
      this.faceRedirectData = {
        type: 'courses',
        action: 'view_courses'
      };
      this.showFaceVerification = true;
    },
    
    goToFaceSetup() {
      // Redirect to profile page for face setup
      this.$router.push({
        name: 'Profile',
        query: { setupFace: true }
      });
    },
    
    // OSCE related methods
    async fetchOsceExams() {
      try {
        this.isLoadingOsceExams = true;
        console.log('Fetching OSCE exams from API');
        
        // Get user subcategory from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userSubcategory = userData.subcategory;
        
        console.log('User subcategory:', userSubcategory);
        
        // For unmanned exams, use the dedicated endpoint
        const params = { 
          published: true
        };
        
        console.log('Fetching unmanned OSCE exams with params:', params);
        const response = await api.getUnmannedExams(params);
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`Loaded ${response.data.length} OSCE exams from API`);
          
          // Filter exams based on user's subcategory
          const filteredExams = response.data.filter(exam => {
            if (!exam.target_subcategories) return false;
            
            // Check if exam is for all users
            if (exam.target_subcategories.includes('all')) {
              return true;
            }
            
            // Check if exam includes user's subcategory
            if (userSubcategory && exam.target_subcategories.includes(userSubcategory)) {
              return true;
            }
            
            return false;
          });
          
          console.log(`Filtered to ${filteredExams.length} exams for user subcategory: ${userSubcategory}`);
          
          // Process the filtered exams
          this.osceExams = this.processOsceExams(filteredExams);
          
          // All fetched exams are unmanned since we used getUnmannedExams
          this.unmannedOsceExams = this.osceExams;
          
          // Fetch manned OSCE stations
          this.fetchMannedOsceExams();
          
          // Filter for diagnostic exams that might be included in OSCE results
          const diagFromOsce = this.osceExams.filter(exam => 
            exam.exam_type === 'DIAGNOSTIC' || exam.examType === 'DIAGNOSTIC'
          );
          
          if (diagFromOsce.length > 0) {
            console.log(`Found ${diagFromOsce.length} diagnostic exams in OSCE results`);
            this.diagnosticExams = this.processDiagnosticExams(diagFromOsce);
          } else {
            // Always fetch diagnostic exams separately - they're typically in their own endpoint
            this.fetchDiagnosticExams();
          }
        } else {
          console.warn('API returned invalid OSCE exam data, falling back to empty list');
          this.osceExams = [];
          this.unmannedOsceExams = [];
          this.diagnosticExams = [];
          
          // Still try to fetch diagnostic exams separately
          this.fetchDiagnosticExams();
        }
      } catch (error) {
        console.error('Error fetching OSCE exams:', error);
        this.osceExams = [];
        this.unmannedOsceExams = [];
        this.diagnosticExams = [];
        
        // Try to fetch diagnostic exams even if OSCE fetch failed
        this.fetchDiagnosticExams();
      } finally {
        this.isLoadingOsceExams = false;
      }
    },
    
    async fetchMannedOsceExams() {
      try {
        console.log('=== FETCHING MANNED OSCE STATIONS ===');
        
        // Get user subcategory from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userSubcategory = userData.subcategory;
        
        console.log('User subcategory for manned OSCE filtering:', userSubcategory);
        
        // Try the api service endpoint first
        console.log('Attempting to fetch from /mocks/manned/stations/');
        const response = await api.get('/mocks/manned/stations/');
        
        console.log('API Response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`Loaded ${response.data.length} manned OSCE stations from API`);
          
          // Log all stations for debugging
          response.data.forEach((station, index) => {
            console.log(`Station ${index + 1}:`, {
              id: station.id,
              title: station.station_details?.title,
              target_subcategories: station.station_details?.exam?.target_subcategories,
              full_station: station
            });
          });
          
          // Filter manned stations based on user's subcategory
          this.mannedOsceExams = response.data.filter(station => {
            // Check if station has a linked exam with target subcategories
            const exam = station.station_details?.exam;
            
            console.log(`\nChecking station ID ${station.id}:`);
            console.log('Station details:', station.station_details);
            console.log('Exam data:', exam);
            
            if (!exam || !exam.target_subcategories) {
              console.log(`  -> Skipping: no exam or target_subcategories`);
              return false;
            }
            
            console.log(`  -> Station "${station.station_details?.title}"`);
            console.log(`  -> Target subcategories:`, exam.target_subcategories);
            console.log(`  -> User subcategory: ${userSubcategory}`);
            
            // Check if exam is for all users
            if (exam.target_subcategories.includes('all')) {
              console.log('  -> INCLUDING: marked for all users');
              return true;
            }
            
            // Check if exam includes user's subcategory
            if (userSubcategory && exam.target_subcategories.includes(userSubcategory)) {
              console.log(`  -> INCLUDING: matches user subcategory ${userSubcategory}`);
              return true;
            }
            
            console.log(`  -> EXCLUDING: no match for subcategory ${userSubcategory}`);
            return false;
          });
          
          console.log(`\nFINAL RESULT: ${this.mannedOsceExams.length} manned stations for user subcategory: ${userSubcategory}`);
          console.log('Filtered stations:', this.mannedOsceExams);
        } else {
          console.log('No manned OSCE data returned from API');
          console.log('Response data type:', typeof response.data);
          console.log('Response data:', response.data);
          this.mannedOsceExams = [];
        }
      } catch (error) {
        console.error('Error fetching manned OSCE stations:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          config: error.config
        });
        this.mannedOsceExams = [];
      }
      
      console.log('=== END MANNED OSCE FETCH ===');
    },
    
    async fetchDiagnosticExams() {
      try {
        console.log('Fetching diagnostic exams from API');
        
        // Prepare parameters for filtering
        let categoryParam = null;
        if (this.userCategoryId) {
          const categoryMap = {
            1: 'nurse',
            2: 'pa',
            3: 'student',
            4: 'doctor',
            5: 'foreign'
          };
          categoryParam = categoryMap[this.userCategoryId];
        }
        
        const params = { 
          published: true
        };
        
        if (categoryParam) {
          params.category = categoryParam;
        }
        
        console.log('Fetching diagnostic exams with params:', params);
        
        try {
          // Use a simpler approach - get all diagnostic exams
          // The backend should filter published ones by default
          const response = await api.getDiagnosticExams();
          
          if (response.data && Array.isArray(response.data)) {
            console.log(`Loaded ${response.data.length} diagnostic exams from API`);
            this.diagnosticExams = this.processDiagnosticExams(response.data);
          } else {
            console.warn('API returned invalid diagnostic exam data, falling back to sample data');
            
            // Always use sample data for now since we're troubleshooting
            console.log('Using sample diagnostic exams for development');
            const sampleDiagnosticExams = [
              {
                id: 1,
                title: 'R2 Storage Test Exam',
                description: 'Test your ability to interpret chest X-rays and identify common pathologies.',
                duration_minutes: 45,
                exam_type: 'DIAGNOSTIC',
                diagnostic_type: 'imaging',
                case_count: 8,
                is_published: true,
                created_at: new Date().toISOString()
              },
              {
                id: 2,
                title: 'Chest X-Ray Interpretation',
                description: 'Test your ability to interpret chest X-rays and identify common pathologies.',
                duration_minutes: 45,
                exam_type: 'DIAGNOSTIC',
                diagnostic_type: 'imaging',
                case_count: 8,
                is_published: true,
                created_at: new Date().toISOString()
              },
              {
                id: 3,
                title: 'ECG Analysis',
                description: 'Identify abnormal cardiac rhythms and conditions from electrocardiograms.',
                duration_minutes: 30,
                exam_type: 'DIAGNOSTIC',
                diagnostic_type: 'ecg',
                case_count: 6,
                is_published: true,
                created_at: new Date().toISOString()
              },
              {
                id: 4,
                title: 'Laboratory Results Interpretation',
                description: 'Practice analyzing common lab tests and identifying abnormal values.',
                duration_minutes: 40,
                exam_type: 'DIAGNOSTIC',
                diagnostic_type: 'lab',
                case_count: 10,
                is_published: true,
                created_at: new Date().toISOString()
              },
              {
                id: 5,
                title: 'CT Scan Interpretation',
                description: 'Practice analyzing CT scans and identifying abnormalities.',
                duration_minutes: 35,
                exam_type: 'DIAGNOSTIC',
                diagnostic_type: 'imaging',
                case_count: 5,
                is_published: true,
                created_at: new Date().toISOString()
              }
            ];
            this.diagnosticExams = this.processDiagnosticExams(sampleDiagnosticExams);
            console.log(`Added ${this.diagnosticExams.length} sample diagnostic exams`);
          }
        } catch (apiError) {
          console.error('API error fetching diagnostic exams:', apiError);
          console.log('Falling back to sample data');
          
          // Add sample data that matches existing database entries
          const sampleDiagnosticExams = [
            {
              id: 1,
              title: 'R2 Storage Test Exam',
              description: 'Test your ability to interpret diagnostic images.',
              duration_minutes: 45,
              exam_type: 'DIAGNOSTIC',
              diagnostic_type: 'imaging',
              case_count: 8,
              is_published: true
            },
            {
              id: 2,
              title: 'rgknqwjrg jonewrfgiq',
              description: 'Diagnostic exam for practice.',
              duration_minutes: 30,
              exam_type: 'DIAGNOSTIC',
              diagnostic_type: 'imaging',
              case_count: 5,
              is_published: true
            },
            {
              id: 3,
              title: 'wgrgw',
              description: 'Practice exam for diagnostics.',
              duration_minutes: 20,
              exam_type: 'DIAGNOSTIC',
              diagnostic_type: 'lab',
              case_count: 4,
              is_published: true
            },
            {
              id: 4,
              title: 'dfhdf',
              description: 'Quick diagnostic practice.',
              duration_minutes: 15,
              exam_type: 'DIAGNOSTIC',
              diagnostic_type: 'ecg',
              case_count: 3,
              is_published: true
            },
            {
              id: 5,
              title: 'ewrq',
              description: 'Short diagnostic assessment.',
              duration_minutes: 10,
              exam_type: 'DIAGNOSTIC',
              diagnostic_type: 'radiology',
              case_count: 2,
              is_published: true
            }
          ];
          
          this.diagnosticExams = this.processDiagnosticExams(sampleDiagnosticExams);
          console.log(`Added ${this.diagnosticExams.length} sample diagnostic exams with real IDs`);
        }
      } catch (error) {
        console.error('Error fetching diagnostic exams:', error);
        this.diagnosticExams = [];
      }
    },
    
    processOsceExams(exams) {
      return exams.map(exam => {
        return {
          ...exam,
          stationType: exam.station_type || 'unmanned',
          stations: exam.stations || [],
          station_count: exam.station_count || (exam.stations ? exam.stations.length : 0),
          duration_minutes: exam.duration_minutes || 30,
          description: exam.description || `OSCE practice exam for ${this.userCategory} with ${exam.station_count || 'multiple'} stations`
        };
      });
    },
    
    processDiagnosticExams(exams) {
      return exams.map(exam => {
        // Map diagnostic_type to a display name for the UI
        const diagnosticTypeMap = {
          'imaging': 'Medical Imaging',
          'lab': 'Laboratory Tests',
          'ecg': 'ECG Interpretation',
          'radiology': 'Radiology',
          'pathology': 'Pathology',
          'x-ray': 'X-Ray Interpretation',
          'ct': 'CT Scan Interpretation',
          'mri': 'MRI Interpretation',
          'ultrasound': 'Ultrasound Interpretation'
        };
        
        const diagnosticTypeIcon = {
          'imaging': 'bi-file-earmark-medical',
          'lab': 'bi-clipboard2-pulse',
          'ecg': 'bi-activity',
          'radiology': 'bi-file-earmark-image',
          'pathology': 'bi-microscope',
          'x-ray': 'bi-file-earmark-medical',
          'ct': 'bi-layers',
          'mri': 'bi-file-earmark-medical',
          'ultrasound': 'bi-soundwave'
        };
        
        // Get the diagnostic type, ensuring case-insensitive matching
        let diagnosticType = '';
        if (exam.diagnostic_type) {
          diagnosticType = exam.diagnostic_type.toLowerCase();
        } else if (exam.diagnosticType) {
          diagnosticType = exam.diagnosticType.toLowerCase();
        }
        
        // Determine case count
        let caseCount = 0;
        if (exam.case_count && !isNaN(parseInt(exam.case_count))) {
          caseCount = parseInt(exam.case_count);
        } else if (exam.cases && Array.isArray(exam.cases)) {
          caseCount = exam.cases.length;
        } else if (exam.caseCount && !isNaN(parseInt(exam.caseCount))) {
          caseCount = parseInt(exam.caseCount);
        }
        
        // Ensure examId is set for routing
        let examId = exam.id || exam.examId;
        
        // Important: Make sure these exams are marked as DIAGNOSTIC type
        // so they don't appear in mock exams list
        return {
          ...exam,
          examId: examId,
          id: examId, // Ensure both are set
          examType: 'DIAGNOSTIC',  // Ensure this is set
          exam_type: 'DIAGNOSTIC', // Set both formats to ensure filtering works
          type: 'DIAGNOSTIC',      // Set all possible variations
          diagnosticTypeName: diagnosticTypeMap[diagnosticType] || 'Diagnostic Interpretation',
          diagnosticTypeIcon: diagnosticTypeIcon[diagnosticType] || 'bi-clipboard-data',
          diagnostic_type: diagnosticType || exam.diagnostic_type || 'imaging',
          case_count: caseCount,
          description: exam.description || `Diagnostic skills assessment for ${diagnosticType || 'medical'} interpretation.`
        };
      });
    },
    
    calculateStationCount(exam) {
      if (exam.station_count) return exam.station_count;
      if (exam.stations && Array.isArray(exam.stations)) return exam.stations.length;
      return 5; // Default fallback value
    },
    
    async startOsceExam(exam) {
      try {
        if (!exam || !exam.id) {
          console.error('Invalid exam data:', exam);
          alert('Error: Invalid exam data');
          return;
        }
        
        this.addUserActivity({
          type: 'exam_started',
          title: 'Started an OSCE exam',
          timestamp: Date.now(),
          courseName: exam.title,
          courseId: exam.id,
          examType: 'OSCE',
          icon: 'bi bi-clipboard-pulse',
          color: 'warning'
        });
        
        // Route to exam page
        if (exam.url) {
          this.$router.push(exam.url);
        } else {
          this.$router.push({
            path: '/exams/mock-exam',
            query: { id: exam.id, type: 'OSCE' }
          });
        }
      } catch (error) {
        console.error('Error starting OSCE exam:', error);
        alert('Failed to start the OSCE exam. Please try again.');
      }
    },
    
    async startMannedOsce(exam) {
      try {
        if (!exam || !exam.id) {
          console.error('Invalid manned OSCE exam data:', exam);
          alert('Error: Invalid exam data');
          return;
        }
        
        // Track activity
        this.addUserActivity({
          type: 'exam_started',
          title: 'Started a manned OSCE exam',
          timestamp: Date.now(),
          courseName: exam.station_details?.title || exam.title,
          courseId: exam.id,
          examType: 'MANNED_OSCE',
          icon: 'bi bi-person-video3',
          color: 'info'
        });
        
        // Route to manned OSCE exam page
        this.$router.push({
          path: '/exams/manned-osce',
          query: { 
            stationId: exam.id,
            examId: exam.station_details?.exam?.id
          }
        });
      } catch (error) {
        console.error('Error starting manned OSCE exam:', error);
        alert('Failed to start the manned OSCE exam. Please try again.');
      }
    },
    
    async startDiagnosticExam(exam) {
      try {
        const examId = exam.id || exam.examId;
        if (!exam || !examId) {
          console.error('Invalid diagnostic exam data:', exam);
          alert('Error: Invalid exam data');
          return;
        }
        
        // Track activity
        this.addUserActivity({
          type: 'exam_started',
          title: 'Started a diagnostic exam',
          timestamp: Date.now(),
          courseName: exam.title,
          courseId: examId,
          examType: 'DIAGNOSTIC',
          icon: 'bi bi-clipboard-data',
          color: 'purple'
        });
        
        // Route to diagnostic exam page
        if (exam.url) {
          this.$router.push(exam.url);
        } else {
          this.$router.push({
            path: `/exams/diagnostic-exam/${examId}`,
          });
        }
      } catch (error) {
        console.error('Error starting diagnostic exam:', error);
        alert('Failed to start the diagnostic exam. Please try again.');
      }
    },
    
    getCourseImage(course) {
      if (course.thumbnail) return course.thumbnail;
      if (course.image) return course.image;
      return this.getDefaultCourseImage(course);
    },
    formatCategory(category) {
      if (!category) return 'General';
      const categoryStr = String(category).toLowerCase();
      const categoryMap = {
        'basic-sciences': 'Basic Sciences',
        'clinical-sciences': 'Clinical Sciences',
        'osce': 'OSCE Preparation',
        'mcq': 'MCQ Practice',
        'general': 'General',
      };
      return categoryMap[categoryStr] || categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
    },
    formatCourseType(courseType) {
      if (!courseType) return 'General';
      const typeStr = String(courseType).toLowerCase();
      const typeMap = {
        'general': 'General Course',
        'mcq': 'MCQ Course',
        'osce': 'OSCE Course',
        'combo': 'MCQ + OSCE'
      };
      return typeMap[typeStr] || typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
    },
    getDefaultCourseImage(course) {
      const courseType = course.course_type || course.courseType || 'general';
      switch(courseType) {
        case 'mcq':
          return '/images/course-covers/mcq.jpg';
        case 'osce':
          return '/images/course-covers/osce.jpg';
        case 'combo':
          return '/images/course-covers/both.jpg';
        default:
          return '/images/course-covers/default.jpg';
      }
    },
    handleImageError(event, course) {
      event.target.src = this.getDefaultCourseImage(course);
    },
    async viewExamResults(examId) {
      if (!examId) return;
      try {
        const exam = this.filteredMockExams.find(e => e.examId == examId) ||
          { title: 'Mock Exam', questions: '100', passmark: 60 };
        if (this.completedExams && this.completedExams[examId] && this.completedExams[examId].length > 0) {
          const dbAttempts = this.completedExams[examId];
          console.log(`Found ${dbAttempts.length} attempts for exam ${examId} from database:`, dbAttempts);
          const firstAttempt = dbAttempts[0] || {};
          const totalQuestions =
            (typeof exam.questions === 'number') ? exam.questions :
            ((typeof exam.questions === 'string' && !isNaN(parseInt(exam.questions))) ? parseInt(exam.questions) :
             (firstAttempt.total_questions ||
               (firstAttempt.correct_answers && firstAttempt.score ?
                 Math.round(firstAttempt.correct_answers / (firstAttempt.score / 100)) : 50)
             )
            );
          console.log(`Determined total questions for exam ${examId}: ${totalQuestions}`);
          this.examResultsData = {
            exam: exam,
            totalQuestions: totalQuestions,
            attempts: dbAttempts
              .map(attempt => ({
                id: attempt.id,
                date: new Date(attempt.completed_at || attempt.started_at).toLocaleDateString(),
                score: parseFloat(attempt.score || 0),
                passed: parseFloat(attempt.score || 0) >= parseFloat(exam.passmark || 60),
                correctAnswers: attempt.correct_answers ||
                  Math.round((parseFloat(attempt.score || 0) / 100) * totalQuestions),
                timeTaken: (() => {
                  if (attempt.time_spent_seconds && !isNaN(parseFloat(attempt.time_spent_seconds))) {
                    const seconds = parseFloat(attempt.time_spent_seconds);
                    if (seconds < 60) return '< 1 minute';
                    return `${Math.round(seconds / 60)} minutes`;
                  }
                  if (attempt.meta && attempt.meta.time_spent_seconds && !isNaN(parseFloat(attempt.meta.time_spent_seconds))) {
                    const seconds = parseFloat(attempt.meta.time_spent_seconds);
                    if (seconds < 60) return '< 1 minute';
                    return `${Math.round(seconds / 60)} minutes`;
                  }
                  if (typeof attempt.time_taken === 'string' && attempt.time_taken.includes('minute')) {
                    return attempt.time_taken;
                  }
                  if (attempt.time_spent && !isNaN(parseFloat(attempt.time_spent))) {
                    if (parseFloat(attempt.time_spent) < 100) {
                      return `${Math.round(parseFloat(attempt.time_spent))} minutes`;
                    }
                    const minutes = Math.round(parseFloat(attempt.time_spent) / 60);
                    if (minutes < 1) return '< 1 minute';
                    return `${minutes} minutes`;
                  }
                  const score = parseFloat(attempt.score || 0);
                  if (score > 80) return '25 minutes';
                  if (score > 70) return '35 minutes';
                  if (score > 60) return '40 minutes';
                  return '45 minutes';
                })()
              }))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
          };
          const scores = this.examResultsData.attempts.map(a => parseFloat(a.score));
          this.examResultsData.highestScore = Math.round(Math.max(...scores));
          this.examResultsData.lowestScore = Math.round(Math.min(...scores));
          this.examResultsData.averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
          this.examResultsData.passRate = Math.round((this.examResultsData.attempts.filter(a => a.passed).length / this.examResultsData.attempts.length) * 100);
          if (scores.length > 1) {
            const chronologicalScores = [...scores].reverse();
            if (chronologicalScores.length >= 2) {
              const midpoint = Math.floor(chronologicalScores.length / 2);
              const olderAttempts = chronologicalScores.slice(0, midpoint);
              const newerAttempts = chronologicalScores.slice(midpoint);
              const olderAvg = olderAttempts.reduce((sum, s) => sum + s, 0) / olderAttempts.length;
              const newerAvg = newerAttempts.reduce((sum, s) => sum + s, 0) / newerAttempts.length;
              if (newerAvg > olderAvg + 5) {
                this.examResultsData.trend = 'improving';
              } else if (newerAvg < olderAvg - 5) {
                this.examResultsData.trend = 'declining';
              } else {
                this.examResultsData.trend = 'consistent';
              }
            } else {
              this.examResultsData.trend = 'new';
            }
          } else {
            this.examResultsData.trend = 'new';
          }
          this.generateExamAdvice();
          this.showExamResultsModal = true;
          return;
        } else {
          console.log(`No exam attempts found in database for exam ${examId}`);
          await this.fetchUserExamAttempts();
          if (this.completedExams && this.completedExams[examId] && this.completedExams[examId].length > 0) {
            console.log(`Found attempts after refresh`);
            this.viewExamResults(examId);
            return;
          } else {
            console.log(`Still no attempts found after refresh`);
          }
          this.$nextTick(() => {
            alert('No previous attempts found for this exam. Please complete the exam first to view results.');
          });
        }
      } catch (e) {
        console.error('Error getting exam attempts:', e);
        this.$nextTick(() => {
          alert('Error retrieving exam attempts. Please try again later.');
        });
      }
    },
    generateExamAdvice() {
      const data = this.examResultsData;
      const advice = [];
      if (data.passRate < 50) {
        advice.push('Focus on strengthening your fundamental knowledge in this area.');
      }
      if (data.highestScore < data.exam.passmark) {
        advice.push('Consider reviewing the course material before attempting again.');
      }
      if (data.trend === 'improving') {
        advice.push('Your scores are improving! Keep up the good work.');
      } else if (data.trend === 'declining') {
        advice.push('Your recent scores have been declining. Consider revisiting key concepts.');
      } else if (data.trend === 'consistent') {
        if (data.averageScore > data.exam.passmark + 10) {
          advice.push('You\'re consistently performing well. Consider trying more advanced exams.');
        } else {
          advice.push('Your scores are consistent. Try different study methods to improve further.');
        }
      }
      if (data.attempts.length < 3) {
        advice.push('Take more practice exams to build confidence and identify knowledge gaps.');
      } else if (data.attempts.length >= 5) {
        advice.push('You\'ve taken this exam multiple times. Consider focusing on weak areas identified in your results.');
      }
      this.examResultsData.advice = advice;
    },
    closeExamResultsModal() {
      this.showExamResultsModal = false;
    },
    // Debug method to check exam visibility
    debugExamVisibility() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('\n=== EXAM VISIBILITY DEBUG ===');
      console.log('Current User:', {
        id: userData.id,
        username: userData.username,
        category: userData.category,
        subcategory: userData.subcategory,
        role: userData.role
      });
      
      console.log('\nAll Mock Exams:');
      this.mockExams.forEach((exam, index) => {
        console.log(`\nExam ${index + 1}: "${exam.title}"`);
        console.log('- ID:', exam.id);
        console.log('- Type:', exam.exam_type || exam.type);
        console.log('- Published:', exam.is_published);
        console.log('- Target Subcategories:', exam.target_subcategories);
        
        // Parse target subcategories if string
        let targetSubs = [];
        if (exam.target_subcategories) {
          try {
            targetSubs = typeof exam.target_subcategories === 'string' 
              ? JSON.parse(exam.target_subcategories) 
              : exam.target_subcategories;
          } catch (e) {
            console.log('- Error parsing target_subcategories:', e.message);
          }
        }
        
        console.log('- Parsed Subcategories:', targetSubs);
        console.log('- User can see?', targetSubs.includes(userData.subcategory) ? 'YES' : 'NO');
      });
      console.log('===========================\n');
    },
    
    async fetchMockExams() {
      try {
        this.isLoadingExams = true;
        console.log('Fetching mock exams from API');
        
        // Get all published exams without category filtering
        // The frontend will handle filtering based on user's subcategory
        const params = { published: true };
        console.log('Fetching exams with params:', params);
        console.log('API request params:', JSON.stringify(params));
        const response = await api.getMockExams(params);
        console.log('Raw API response:', JSON.stringify(response.data));
        if (response.data && Array.isArray(response.data)) {
          console.log(`Loaded ${response.data.length} mock exams from API`);
          
          // Log all exams to see what we're getting
          console.log('=== ALL EXAMS FROM API ===');
          response.data.forEach((exam, index) => {
            console.log(`Exam ${index + 1}: ${exam.title}`);
            console.log('  - ID:', exam.id);
            console.log('  - Type:', exam.exam_type);
            console.log('  - Target Subcategories:', JSON.stringify(exam.target_subcategories));
            console.log('  - Target Subcategories Type:', typeof exam.target_subcategories);
            console.log('  - User Category:', exam.user_category);
            console.log('  - Published:', exam.is_published);
            
            // Check if this is a doctor-specific exam
            if (exam.target_subcategories && 
                (Array.isArray(exam.target_subcategories) ? 
                 exam.target_subcategories : []).some(sub => sub.includes('doctor'))) {
              console.log('  -> This is a DOCTOR-SPECIFIC exam');
            }
          });
          console.log('========================');
          
          // Ensure all exams have proper data format
          this.mockExams = response.data.map(exam => {
            console.log(`Processing exam: ${exam.title}`);
            const processedExam = {
              ...exam,
              exam_type: exam.exam_type || exam.type || 'MCQ',
              type: exam.exam_type || exam.type || 'MCQ',
              examType: exam.exam_type || exam.type || 'MCQ'
            };
            console.log(`  - Original target_subcategories:`, exam.target_subcategories);
            console.log(`  - Processed exam type:`, processedExam.exam_type);
            return processedExam;
          });
          
          // Debug exam visibility after setting mockExams
          this.debugExamVisibility();
        } else {
          console.warn('API returned invalid mock exam data, falling back to sample data');
        }
      } catch (error) {
        console.error('Error fetching mock exams:', error);
      } finally {
        this.isLoadingExams = false;
        this.fetchUserExamAttempts();
      }
    },
    addProgressToCourses(courses) {
      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      const courseStatuses = JSON.parse(localStorage.getItem('courseStatuses') || '{}');
      const courseStartDates = JSON.parse(localStorage.getItem('courseStartDates') || '{}');
      const courseCompletionDates = JSON.parse(localStorage.getItem('courseCompletionDates') || '{}');
      return courses.map(course => {
        const courseId = course.id;
        if (!courseId) return { ...course, progress: 0, status: 'not-started' };
        const status = courseStatuses[courseId] || 'not-started';
        const startDate = courseStartDates[courseId] || null;
        const completionDate = courseCompletionDates[courseId] || null;
        const courseKey = `course_${courseId}`;
        const completedLessonsForCourse = completedLessons[courseKey] || [];
        let totalLessons = 0;
        if (course.modules && Array.isArray(course.modules)) {
          course.modules.forEach(module => {
            if (module.lessons && Array.isArray(module.lessons)) {
              totalLessons += module.lessons.length;
            }
          });
        }
        let progress = 0;
        if (totalLessons > 0) {
          progress = Math.round((completedLessonsForCourse.length / totalLessons) * 100);
        }
        if (status === 'completed') {
          progress = 100;
        }
        if (progress === 100 && status !== 'completed') {
          courseStatuses[courseId] = 'completed';
          localStorage.setItem('courseStatuses', JSON.stringify(courseStatuses));
          if (!completionDate) {
            courseCompletionDates[courseId] = new Date().toISOString();
            localStorage.setItem('courseCompletionDates', JSON.stringify(courseCompletionDates));
          }
        }
        return { 
          ...course, 
          progress,
          status,
          startDate,
          completionDate
        };
      });
    },
    getCategoryName(category) {
      const categoryMap = {
        'nurse': 'Nurse',
        'physician-assistant': 'Physician Assistant',
        'medical-student': 'Medical Student',
        'doctor': 'Medical Doctor',
        'foreign-exam': 'Foreign Exam Candidate'
      };
      return categoryMap[category] || 'Student';
    },
    getCategoryIcon(category) {
      const iconMap = {
        'nurse': 'bi bi-heart-pulse',
        'physician-assistant': 'bi bi-clipboard2-pulse',
        'medical-student': 'bi bi-mortarboard',
        'doctor': 'bi bi-hospital',
        'foreign-exam': 'bi bi-globe'
      };
      return iconMap[category] || 'bi bi-person';
    },
    getCategoryClass(category) {
      const classMap = {
        'nurse': 'nurse',
        'physician-assistant': 'pa',
        'medical-student': 'student',
        'doctor': 'doctor',
        'foreign-exam': 'exam'
      };
      return classMap[category] || 'default';
    },
    getCategoryShortName(category) {
      const shortNameMap = {
        'nurse': 'RN',
        'physician-assistant': 'PA',
        'medical-student': 'MED',
        'doctor': 'MD',
        'foreign-exam': 'FE'
      };
      return shortNameMap[category] || 'STD';
    },
    getCategoryDescription(category) {
      const descriptionMap = {
        'nurse': 'Registered Nurse focused content',
        'physician-assistant': 'Physician Assistant specialized material',
        'medical-student': 'Medical student curriculum support',
        'doctor': 'Professional medical practitioner resources',
        'foreign-exam': 'International medical exam preparation'
      };
      return descriptionMap[category] || 'Standard learning materials';
    },
    async fetchUserCourses() {
      this.isLoadingCourses = true;
      try {
        let coursesData = [];
        try {
          const response = await this.$store.dispatch('fetchCourses');
          if (response && Array.isArray(response)) {
            coursesData = response;
          }
        } catch (apiError) {
          console.error('Error fetching courses from API:', apiError);
        }
        if (coursesData.length === 0) {
          console.log('Using sample course data for dashboard');
          coursesData = this.getSampleCourses();
        }
        coursesData = coursesData.map(course => {
          if (!course.link || typeof course.link !== 'string' || !course.link.trim()) {
            console.warn(`Course ${course.id || course.title} has invalid link, using fallback`);
            return { ...course, link: '/dashboard' };
          }
          return course;
        });
        coursesData = this.filterCoursesByUserAccess(coursesData);
        coursesData = this.addProgressToCourses(coursesData);
        this.myCourses = coursesData;
        this.updateCourseStats();
      } catch (error) {
        console.error('Error in fetchUserCourses:', error);
      } finally {
        this.isLoadingCourses = false;
      }
    },
    filterCoursesByUserAccess(courses) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userSubcategory = userData.subcategory || userData.user_subcategory;
      
      // Admins see all courses
      const isAdmin = userData?.is_staff || (userData?.role_details?.name === 'admin') || (userData?.role === 'admin');
      if (isAdmin) return courses;
      
      // If no subcategory, fall back to category-based filtering
      if (!userSubcategory && !this.userCategoryId) return courses;
      
      let filteredCourses = [...courses];
      filteredCourses = filteredCourses.filter(course => {
        // Only show published courses
        if (course.status && course.status.toLowerCase() !== 'published') {
          return false;
        }
        
        // First, check the new target_subcategories field
        if (course.target_subcategories) {
          let targetSubcategories = [];
          if (typeof course.target_subcategories === 'string' && course.target_subcategories.trim().startsWith('[')) {
            try {
              targetSubcategories = JSON.parse(course.target_subcategories);
            } catch (e) {
              console.warn('Error parsing target_subcategories:', e);
            }
          } else if (Array.isArray(course.target_subcategories)) {
            targetSubcategories = course.target_subcategories;
          }
          
          // If subcategories are set and user has subcategory, check if user is included
          if (targetSubcategories.length > 0 && userSubcategory) {
            const isForAll = targetSubcategories.includes('all');
            return isForAll || targetSubcategories.includes(userSubcategory);
          }
        }
        
        // Check target_audience field (which now contains subcategories)
        if (course.target_audience) {
          let targetAudience = [];
          if (typeof course.target_audience === 'string' && course.target_audience.trim().startsWith('[')) {
            try {
              targetAudience = JSON.parse(course.target_audience);
            } catch (e) {
              console.warn('Error parsing target_audience:', e);
            }
          } else if (Array.isArray(course.target_audience)) {
            targetAudience = course.target_audience;
          }
          
          if (targetAudience.length > 0) {
            // If user has subcategory, check if user is included  
            if (userSubcategory) {
              const isForAll = targetAudience.includes('all');
              return isForAll || targetAudience.includes(userSubcategory);
            }
            
            // Fallback: convert category ID to category string for old data
            const categoryIdToString = {
              1: 'nurse',
              2: 'physician-assistant',
              3: 'medical-student',
              4: 'doctor',
              5: 'foreign-exam'
            };
            const userCategoryString = isNaN(parseInt(this.userCategoryId)) ? this.userCategoryId : categoryIdToString[this.userCategoryId];
            
            // Check if any of the target audience subcategories match the user's category
            // This allows backward compatibility for users without subcategory
            return targetAudience.some(subcategory => subcategory.includes(userCategoryString));
          }
        }
        
        // Legacy filtering for old data
        if (Array.isArray(course.userCategories) && course.userCategories.length > 0 && !course.userCategories.includes(this.userCategoryId)) {
          return false;
        }
        
        if (course.user_category_ids) {
          let categoryIds = [];
          if (typeof course.user_category_ids === 'string' && course.user_category_ids.trim().startsWith('[')) {
            try {
              categoryIds = JSON.parse(course.user_category_ids);
            } catch (e) {
              console.warn('Error parsing user_category_ids:', e);
            }
          } else if (Array.isArray(course.user_category_ids)) {
            categoryIds = course.user_category_ids;
          }
          if (categoryIds.length > 0 && !categoryIds.includes(this.userCategoryId)) {
            return false;
          }
        }
        
        // Special filtering for medical students with OSCE only
        if (this.userCategoryId === 3 && this.osceOnly) {
          if (course.course_type && (course.course_type.toLowerCase() === 'mcq' || course.course_type.toLowerCase() === 'mcqs')) {
            return false; 
          }
          if (course.courseType && (course.courseType.toLowerCase() === 'mcq' || course.courseType.toLowerCase() === 'mcqs')) {
            return false;
          }
          if ((!course.courseType && !course.course_type) && course.title.toLowerCase().includes('mcq')) {
            return false;
          }
        }
        
        return true;
      });
      
      return filteredCourses;
    },
    updateCourseStats() {
      const completedCourses = this.myCourses.filter(course => course.status === 'completed').length;
      const inProgressCourses = this.myCourses.filter(course => course.status === 'in-progress').length;
      this.statsData = [
        { 
          label: 'Courses', 
          value: this.myCourses.length.toString(), 
          icon: 'bi bi-book',
          color: 'primary'
        },
        { 
          label: 'Completed', 
          value: completedCourses.toString(), 
          icon: 'bi bi-check-circle',
          color: 'success' 
        },
        { 
          label: 'In Progress', 
          value: inProgressCourses.toString(), 
          icon: 'bi bi-hourglass-split',
          color: 'warning'
        }
      ];
    },
    loadUserActivities() {
      this.isLoadingActivities = true;
      try {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.sort((a, b) => b.timestamp - a.timestamp);
        activities.forEach(activity => {
          activity.time = this.formatActivityTime(activity.timestamp);
          if (!activity.color) {
            activity.color = this.getActivityColorForType(activity.type);
          }
        });
        this.recentActivities = activities;
      } catch (error) {
        console.error('Error loading user activities:', error);
        this.recentActivities = [];
      } finally {
        setTimeout(() => {
          this.isLoadingActivities = false;
        }, 400);
      }
    },
    updateActivityTimes() {
      this.recentActivities.forEach(activity => {
        activity.time = this.formatActivityTime(activity.timestamp);
      });
    },
    formatActivityTime(timestamp) {
      if (!timestamp) return 'Unknown time';
      const now = Date.now();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      if (seconds < 60) {
        return 'Just now';
      } else if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      } else if (hours < 24) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else if (days < 7) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      } else if (weeks < 4) {
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      } else {
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
    },
    addUserActivity(activity) {
      if (!activity || !activity.title) return;
      try {
        if (!activity.timestamp) {
          activity.timestamp = Date.now();
        }
        activity.time = this.formatActivityTime(activity.timestamp);
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.unshift(activity);
        const trimmedActivities = activities.slice(0, 50);
        localStorage.setItem('userActivities', JSON.stringify(trimmedActivities));
        this.recentActivities = trimmedActivities;
      } catch (error) {
        console.error('Error adding user activity:', error);
      }
    },
    getActivityIcon(activityType) {
      const iconMap = {
        'course_started': 'bi bi-play-circle',
        'course_resumed': 'bi bi-arrow-clockwise',
        'course_completed': 'bi bi-trophy-fill',
        'lesson_completed': 'bi bi-check-circle-fill',
        'module_completed': 'bi bi-check-square',
        'exam_started': 'bi bi-pencil-square',
        'exam_completed': 'bi bi-file-earmark-check',
        'profile_updated': 'bi bi-person-check',
        'login': 'bi bi-box-arrow-in-right',
        'registration': 'bi bi-person-plus',
        'payment': 'bi bi-credit-card',
        'subscription': 'bi bi-star-fill',
        'dashboard_viewed': 'bi bi-speedometer2',
        'settings_changed': 'bi bi-gear',
        'video_watched': 'bi bi-play-btn',
        'material_downloaded': 'bi bi-download',
      };
      return iconMap[activityType] || 'bi bi-activity';
    },
    getActivityColorForType(activityType) {
      const colorMap = {
        'course_started': 'primary',
        'course_resumed': 'primary',
        'course_completed': 'success',
        'lesson_completed': 'success',
        'module_completed': 'success',
        'exam_started': 'warning',
        'exam_completed': 'success',
        'profile_updated': 'info',
        'login': 'info',
        'registration': 'info',
        'payment': 'danger',
        'subscription': 'danger',
        'dashboard_viewed': 'info',
        'settings_changed': 'secondary',
        'video_watched': 'primary',
        'material_downloaded': 'info',
      };
      return colorMap[activityType] || 'primary';
    },
    setupActivityTracking() {
      this.menuItems.forEach(item => {
        this.$watch(
          () => this.activeSection === item.value,
          (isActive) => {
            if (isActive && item.value !== 'overview') {
              this.addUserActivity({
                type: `${item.value}_section_viewed`,
                title: `Viewed ${item.label}`,
                timestamp: Date.now(),
                icon: item.icon,
                color: 'info'
              });
            }
          }
        );
      });
      if (this.$root && this.$root.$on) {
        this.$root.$off('track-activity');
        this.$root.$on('track-activity', (activity) => {
          this.addUserActivity(activity);
        });
      }
      if (this.$store && this.$store.subscribe) {
        this.$store.subscribe((mutation) => {
          if (mutation.type === 'setCourseStatus' && mutation.payload) {
            const { courseId, status } = mutation.payload;
            let courseTitle = 'a course';
            const course = this.myCourses.find(c => c.id === courseId);
            if (course) {
              courseTitle = course.title;
            }
            if (status === 'completed') {
              this.addUserActivity({
                type: 'course_completed',
                title: 'Completed a course',
                courseName: courseTitle,
                courseId,
                timestamp: Date.now(),
                icon: 'bi bi-trophy-fill',
                color: 'success'
              });
            } else if (status === 'in-progress') {
              const isNewStart = !mutation.payload.previousStatus;
              this.addUserActivity({
                type: isNewStart ? 'course_started' : 'course_resumed',
                title: isNewStart ? 'Started a new course' : 'Resumed a course',
                courseName: courseTitle,
                courseId,
                timestamp: Date.now(),
                icon: isNewStart ? 'bi bi-play-circle' : 'bi bi-arrow-clockwise',
                color: 'primary'
              });
            }
          }
          if (mutation.type === 'setLessonCompleted' && mutation.payload) {
            const { courseId, lessonId, lessonTitle } = mutation.payload;
            let courseTitle = 'a course';
            const course = this.myCourses.find(c => c.id === courseId);
            if (course) {
              courseTitle = course.title;
            }
            this.addUserActivity({
              type: 'lesson_completed',
              title: 'Completed a lesson',
              courseName: courseTitle,
              lessonName: lessonTitle,
              courseId,
              lessonId,
              timestamp: Date.now(),
              icon: 'bi bi-check-circle-fill',
              color: 'success'
            });
          }
        });
      }
    },
    viewAllActivities() {
      this.isViewingAllActivities = true;
      this.addUserActivity({
        type: 'activity_history_viewed',
        title: 'Viewed full activity history',
        timestamp: Date.now(),
        icon: 'bi bi-clock-history',
        color: 'info'
      });
      alert('Feature coming soon: View complete activity history');
    },
    getSampleCourses() {
      return [
        {
          id: 1,
          title: 'Fundamentals of Anatomy',
          description: 'A comprehensive introduction to human anatomy covering all major body systems.',
          image: '/images/courses/anatomy-course.jpg',
          progress: 75,
          courseType: 'general',
          userCategories: [1, 2, 3, 4, 5]
        },
        {
          id: 2,
          title: 'Clinical Diagnosis Skills',
          description: 'Learn essential diagnostic skills for identifying common conditions in clinical practice.',
          image: '/images/courses/clinical-diagnosis.jpg',
          progress: 45,
          courseType: 'general',
          userCategories: [1, 2, 3, 4, 5]
        },
        {
          id: 3,
          title: 'OSCE Preparation',
          description: 'History taking, physical examination, and procedures.',
          image: '/images/courses/osce-preparation.jpg',
          progress: 60,
          courseType: 'osce',
          userCategories: [3]
        },
        {
          id: 4,
          title: 'MCQ Practice',
          description: 'Multiple choice questions for comprehensive exam preparation.',
          image: '/images/courses/mcq-practice.jpg',
          progress: 30,
          courseType: 'mcq',
          userCategories: [3, 4]
        },
        {
          id: 5,
          title: 'Nursing: Patient Care',
          description: 'Essential nursing skills for patient assessment and care.',
          image: '/images/courses/nursing-care.jpg',
          progress: 50,
          courseType: 'general',
          userCategories: [1]
        },
        {
          id: 6,
          title: 'Physician Assistant Skills',
          description: 'Clinical procedures and diagnostic techniques for physician assistants.',
          image: '/images/courses/pa-skills.jpg',
          progress: 25,
          courseType: 'general',
          userCategories: [2]
        }
      ];
    },
    setProfileImageUrl() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.profile_picture_url) {
        console.log("Using profile picture URL from user data:", userData.profile_picture_url);
        if (userData.profile_picture_url.startsWith('/media')) {
          this.profileImageUrl = `${window.location.protocol}//${window.location.hostname}:8000${userData.profile_picture_url}`;
          return;
        }
        this.profileImageUrl = userData.profile_picture_url;
        return;
      }
      const savedProfileImage = localStorage.getItem('profileImage');
      if (savedProfileImage) {
        this.profileImageUrl = savedProfileImage;
        return;
      }
      if (userData.category) {
        console.log("Using category-based avatar for category:", userData.category);
        const categoryIcons = {
          1: '/images/defaults/nurse-icon.png',
          2: '/images/defaults/pa-icon.png',
          3: '/images/defaults/student-icon.png',
          4: '/images/defaults/doctor-icon.png',
          5: '/images/defaults/exam-icon.png'
        };
        if (categoryIcons[userData.category]) {
          this.profileImageUrl = categoryIcons[userData.category];
          return;
        }
      }
      if (userData.sex === 'M') {
        this.profileImageUrl = '/images/defaults/doctor-icon.png';
      } else if (userData.sex === 'F') {
        this.profileImageUrl = '/images/defaults/nurse-icon.png';
      } else {
        this.profileImageUrl = '/images/defaults/user-icon.png';
      }
    },
    saveProfile() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.firstName = this.profileData.firstName;
      userData.lastName = this.profileData.lastName;
      userData.whatsapp = this.profileData.whatsapp;
      userData.category = this.profileData.category;
      localStorage.setItem('user', JSON.stringify(userData));
      if (this.$store && this.$store.commit) {
        this.$store.commit('setUser', userData);
      }
      alert('Profile updated successfully!');
    },
    changePassword() {
      if (!this.passwordData.current) {
        alert('Please enter your current password');
        return;
      }
      if (!this.passwordData.new || this.passwordData.new.length < 8) {
        alert('New password must be at least 8 characters long');
        return;
      }
      if (this.passwordData.new !== this.passwordData.confirm) {
        alert('New passwords do not match');
        return;
      }
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.password !== this.passwordData.current) {
        alert('Current password is incorrect');
        return;
      }
      userData.password = this.passwordData.new;
      localStorage.setItem('user', JSON.stringify(userData));
      this.passwordData.current = '';
      this.passwordData.new = '';
      this.passwordData.confirm = '';
      alert('Password updated successfully!');
    },
    applyTheme(theme) {
      console.log('Applying theme:', theme);
      const body = document.body;
      body.classList.remove('theme-light', 'theme-dark');
      let isDarkMode = false;
      if (theme === 'system') {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = prefersDarkScheme;
        body.classList.add(prefersDarkScheme ? 'theme-dark' : 'theme-light');
      } else {
        isDarkMode = theme === 'dark';
        body.classList.add(`theme-${theme}`);
      }
      body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.style.setProperty('--bg-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--card-bg', '#1e1e1e');
        document.documentElement.style.setProperty('--border-color', '#333333');
        document.documentElement.style.setProperty('--primary-hover', '#00b3b0');
        document.documentElement.style.setProperty('--card-shadow', '0 5px 15px rgba(0, 0, 0, 0.3)');
      } else {
        document.documentElement.style.setProperty('--bg-color', '#f5f7fa');
        document.documentElement.style.setProperty('--text-color', '#2c3e50');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.style.setProperty('--border-color', '#e0e0e0');
        document.documentElement.style.setProperty('--primary-hover', '#00dad5');
        document.documentElement.style.setProperty('--card-shadow', '0 5px 15px rgba(0, 0, 0, 0.05)');
      }
      console.log('Theme applied. Dark mode:', isDarkMode);
      console.log('Body classes:', body.className);
      console.log('Data theme attribute:', body.getAttribute('data-theme'));
    },
    applyFontSize(size) {
      console.log('Applying font size:', size);
      const body = document.body;
      body.classList.remove('font-small', 'font-medium', 'font-large');
      body.classList.add(`font-${size}`);
      body.setAttribute('data-font-size', size);
      let rootFontSize, paragraphSize, headingScale;
      switch(size) {
        case 'small':
          rootFontSize = '14px';
          paragraphSize = '0.9rem';
          headingScale = '1.1';
          break;
        case 'large':
          rootFontSize = '18px';
          paragraphSize = '1.1rem';
          headingScale = '1.3';
          break;
        default:
          rootFontSize = '16px';
          paragraphSize = '1rem';
          headingScale = '1.2';
      }
      document.documentElement.style.setProperty('--root-font-size', rootFontSize);
      document.documentElement.style.setProperty('--paragraph-size', paragraphSize);
      document.documentElement.style.setProperty('--heading-scale', headingScale);
      document.documentElement.style.fontSize = rootFontSize;
      console.log('Font size applied:', size);
      console.log('Root font size:', rootFontSize);
      console.log('Body classes:', body.className);
    },
    // Renamed this method from toggleAnimations to applyAnimations
    applyAnimations(enabled) {
      console.log('Applying animations setting:', enabled);
      const body = document.body;
      if (!enabled) {
        body.classList.add('no-animations');
        document.documentElement.style.setProperty('--transition-speed', '0s');
      } else {
        body.classList.remove('no-animations');
        document.documentElement.style.setProperty('--transition-speed', '0.3s');
      }
      body.setAttribute('data-animations', enabled ? 'enabled' : 'disabled');
      console.log('Animations setting applied:', enabled);
      console.log('Body classes:', body.className);
    },
    changeTheme(theme) {
      this.settings.theme = theme;
      this.applyTheme(theme);
      this.autoSaveSettings();
      const themeName = theme === 'system' ? 'System Default' : (theme === 'dark' ? 'Dark' : 'Light');
      this.showToast(`Theme changed to ${themeName}`);
    },
    changeFontSize(size) {
      this.settings.fontSize = size;
      this.applyFontSize(size);
      this.autoSaveSettings();
      const sizeName = size === 'small' ? 'Small' : (size === 'large' ? 'Large' : 'Medium');
      this.showToast(`Font size changed to ${sizeName}`);
    },
    autoSaveSettings() {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
    },
    saveSettings() {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      this.applyTheme(this.settings.theme);
      this.applyFontSize(this.settings.fontSize);
      this.applyAnimations(this.settings.animations);
      alert('Settings saved successfully!');
    },
    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'settings-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('visible');
      }, 10);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    },
    
    // Methods for the redesigned mock exams section
    getExamTypeClass(examType) {
      if (!examType) return 'mcq-exam';
      
      const type = examType.toLowerCase();
      if (type === 'osce') return 'osce-exam';
      return 'mcq-exam';
    },
    
    getExamTypeIcon(examType) {
      if (!examType) return 'bi bi-journal-check';
      
      const type = examType.toLowerCase();
      if (type === 'osce') return 'bi bi-clipboard-pulse';
      return 'bi bi-journal-check';
    },
    
    getScoreClass(score) {
      if (score >= 70) return 'score-high';
      if (score >= 50) return 'score-medium';
      return 'score-low';
    },
    
    getBestAttemptScore(examId) {
      if (!examId || !this.completedExams || !this.completedExams[examId]) return 0;
      
      const attempts = this.completedExams[examId];
      if (!attempts || attempts.length === 0) return 0;
      
      const scores = attempts.map(attempt => parseFloat(attempt.score || 0));
      return Math.max(...scores);
    },
    
    getAttemptCount(examId) {
      if (!examId || !this.completedExams || !this.completedExams[examId]) return 0;
      return this.completedExams[examId].length;
    },
    
    getProgressText(examId) {
      if (!examId || !this.completedExams || !this.completedExams[examId]) return 'Not Started';
      
      const attempts = this.completedExams[examId];
      if (!attempts || attempts.length === 0) return 'Not Started';
      
      const bestScore = this.getBestAttemptScore(examId);
      
      if (bestScore >= 80) return 'Excellent';
      if (bestScore >= 70) return 'Good';
      if (bestScore >= 60) return 'Satisfactory';
      return 'Needs Improvement';
    },
    
    getExamKeywords(exam) {
      if (!exam) return ['Medical', 'Exam', 'Assessment'];
      
      // Try to extract keywords from the exam content or generate based on title
      const defaultKeywords = ['Medical', 'Exam', 'Assessment'];
      const specificKeywords = [];
      
      if (exam.examType) {
        const type = exam.examType.toLowerCase();
        if (type === 'mcq') specificKeywords.push('Multiple Choice');
        if (type === 'osce') specificKeywords.push('Clinical Skills');
      }
      
      // Extract words from title
      if (exam.title) {
        const titleWords = exam.title.split(' ');
        const keywordCandidates = titleWords.filter(word => 
          word.length > 3 && 
          !['exam', 'mock', 'test', 'quiz', 'the', 'and', 'for'].includes(word.toLowerCase())
        );
        
        // Add up to 2 words from title
        for (let i = 0; i < Math.min(2, keywordCandidates.length); i++) {
          specificKeywords.push(keywordCandidates[i]);
        }
      }
      
      // If we have specific keywords, use those plus some defaults to fill up to 4
      if (specificKeywords.length > 0) {
        const combinedKeywords = [...specificKeywords];
        
        // Add default keywords if needed to reach 4 total
        let i = 0;
        while (combinedKeywords.length < 4 && i < defaultKeywords.length) {
          if (!combinedKeywords.includes(defaultKeywords[i])) {
            combinedKeywords.push(defaultKeywords[i]);
          }
          i++;
        }
        
        return combinedKeywords.slice(0, 4); // Limit to 4 keywords
      }
      
      // If no specific keywords found, return default set
      return defaultKeywords;
    },
    
    refreshExams() {
      this.fetchMockExams();
    },
    
    getUserSubcategory() {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return userData.subcategory;
    }
  }
};
</script>

<style scoped lang="scss">
/* Your existing SCSS styles remain unchanged */

/* OSCE Practice Section Styles */
.osce-exam-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 206, 201, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
  
  &.taken-exam {
    border-color: rgba(40, 167, 69, 0.2);
    
    .exam-icon {
      background: linear-gradient(45deg, rgba(40, 167, 69, 0.1), rgba(46, 204, 113, 0.1));
      color: #28a745;
    }
  }
  
  .exam-status-ribbon {
    position: absolute;
    top: 20px;
    right: -35px;
    background: linear-gradient(to right, #28a745, #2ecc71);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 40px;
    transform: rotate(45deg);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
    
    i {
      margin-right: 5px;
    }
  }
  
  .exam-header {
    display: flex;
    margin-bottom: 20px;
    
    .exam-icon {
      width: 60px;
      height: 60px;
      border-radius: 15px;
      background: linear-gradient(45deg, rgba(0, 206, 201, 0.1), rgba(32, 227, 222, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      margin-right: 20px;
      flex-shrink: 0;
      color: var(--primary-color);
    }
    
    .exam-info {
      flex: 1;
      
      .exam-title {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
      
      .exam-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .badge {
          padding: 6px 10px;
          font-weight: 500;
          font-size: 0.8rem;
          
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
  
  .exam-body {
    margin-bottom: 20px;
    
    p {
      color: #6c757d;
      margin-bottom: 15px;
      line-height: 1.5;
    }
    
    .osce-features {
      background-color: rgba(0, 206, 201, 0.05);
      border-radius: 10px;
      padding: 15px;
      
      .feature-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        i {
          color: #28a745;
          margin-right: 10px;
          font-size: 0.9rem;
        }
        
        span {
          font-size: 0.9rem;
          color: #495057;
        }
      }
    }
  }
  
  .exam-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      
      &.btn-primary {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        
        &:hover {
          background-color: var(--primary-hover);
          border-color: var(--primary-hover);
        }
      }
    }
  }
}

.osce-categories {
  .nav-tabs {
    border-bottom: 1px solid rgba(0, 206, 201, 0.2);
    
    .nav-link {
      border: none;
      padding: 12px 20px;
      font-weight: 500;
      color: #495057;
      border-radius: 0;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--primary-color);
        border-bottom-color: rgba(0, 206, 201, 0.3);
      }
      
      &.active {
        color: var(--primary-color);
        background-color: transparent;
        border-bottom-color: var(--primary-color);
      }
      
      .badge {
        font-size: 0.7rem;
        font-weight: 500;
        padding: 4px 8px;
      }
    }
  }
}

.manned-osce-features {
  max-width: 700px;
  margin: 0 auto;
  
  .card {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 206, 201, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
    }
    
    h5 {
      color: var(--primary-color);
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    p {
      color: #6c757d;
      font-size: 0.9rem;
    }
  }
}
/* Mock Exams Section Styles */
.section-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  h2 {
    margin-bottom: 0;
  }
  
  .section-actions {
    display: flex;
    gap: 15px;
    
    .search-filter {
      position: relative;
      
      i {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #adb5bd;
        z-index: 1;
      }
      
      input {
        padding-left: 35px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        background-color: #f8f9fa;
        transition: all 0.3s ease;
        
        &:focus {
          border-color: var(--primary-color);
          background-color: white;
          box-shadow: 0 0 0 0.2rem rgba(0, 206, 201, 0.25);
        }
      }
    }
    
    .exam-type-filter {
      .btn {
        border-radius: 8px;
        border: 1px solid #e9ecef;
        padding: 0.375rem 1rem;
        
        i {
          margin-right: 5px;
        }
      }
    }
  }
}

.mock-exam-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
  padding: 25px;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  &.completed-exam {
    border-color: rgba(40, 167, 69, 0.15);
  }
  
  .exam-status-ribbon {
    position: absolute;
    top: 20px;
    right: -35px;
    z-index: 1;
    
    .ribbon-content {
      background: linear-gradient(45deg, #28a745, #2ecc71);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 5px 40px;
      transform: rotate(45deg);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  .exam-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .exam-type-icon {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 1.5rem;
      
      &.mcq-exam {
        background: linear-gradient(45deg, rgba(13, 110, 253, 0.1), rgba(66, 139, 255, 0.1));
        color: #0d6efd;
      }
      
      &.osce-exam {
        background: linear-gradient(45deg, rgba(102, 16, 242, 0.1), rgba(137, 68, 255, 0.1));
        color: #6610f2;
      }
    }
    
    .exam-header-content {
      flex: 1;
      
      .exam-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: #212529;
      }
      
      .exam-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .badge {
          display: flex;
          align-items: center;
          font-weight: 500;
          padding: 5px 10px;
          
          i {
            margin-right: 5px;
          }
        }
      }
    }
    
    .exam-score {
      margin-left: 15px;
      
      .score-circle {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        
        &.score-high {
          background: linear-gradient(45deg, #28a745, #2ecc71);
          color: white;
        }
        
        &.score-medium {
          background: linear-gradient(45deg, #fd7e14, #f39c12);
          color: white;
        }
        
        &.score-low {
          background: linear-gradient(45deg, #dc3545, #e74c3c);
          color: white;
        }
        
        .score-value {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .score-label {
          font-size: 0.7rem;
          opacity: 0.9;
        }
      }
    }
  }
  
  .exam-body {
    margin-bottom: 20px;
    
    .exam-description {
      color: #6c757d;
      margin-bottom: 20px;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .exam-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 15px;
      
      .detail-item {
        display: flex;
        align-items: center;
        
        .detail-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: rgba(0, 206, 201, 0.1);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .detail-content {
          flex: 1;
          
          .detail-label {
            font-size: 0.75rem;
            color: #6c757d;
            margin-bottom: 2px;
          }
          
          .detail-value {
            font-size: 0.9rem;
            font-weight: 600;
            color: #212529;
          }
        }
      }
    }
    
    .exam-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .keyword {
        background-color: rgba(0, 206, 201, 0.1);
        color: var(--primary-color);
        font-size: 0.8rem;
        padding: 5px 12px;
        border-radius: 15px;
        font-weight: 500;
      }
    }
  }
  
  .exam-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    
    .btn {
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      
      i {
        margin-right: 5px;
      }
    }
  }
}

.loading-indicator, .no-exams-message {
  .no-data-icon, .spinner-border {
    font-size: 3rem;
    color: #dee2e6;
    margin-bottom: 15px;
  }
  
  h3 {
    color: #495057;
    margin-bottom: 10px;
  }
  
  p {
    color: #6c757d;
    max-width: 400px;
    margin: 0 auto 20px;
  }
}

/* Exam Results Modal Styles */
.exam-results-header {
  background: linear-gradient(45deg, #00CEC9, #20e3de);
  color: white;
  
  .modal-title {
    display: flex;
    align-items: center;
    font-weight: 600;
    
    i {
      margin-right: 10px;
      font-size: 1.2rem;
    }
  }
  
  .btn-close {
    color: white;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
}

.results-summary {
  .result-stat {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 1px solid #e9ecef;
    
    &.good {
      background-color: rgba(40, 167, 69, 0.1);
      border-color: rgba(40, 167, 69, 0.2);
      
      .stat-value {
        color: #28a745;
      }
    }
    
    &.attempts {
      background-color: rgba(108, 117, 125, 0.1);
      border-color: rgba(108, 117, 125, 0.2);
      
      .stat-value {
        color: #6c757d;
      }
    }
    
    .stat-label {
      font-size: 0.85rem;
      color: #6c757d;
      margin-bottom: 5px;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #212529;
    }
  }
  
  .performance-trend {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    
    .trend-label {
      margin-bottom: 0;
      margin-right: 15px;
      font-weight: 600;
    }
    
    .trend-value {
      font-weight: 600;
      
      i {
        margin-right: 5px;
      }
      
      .improving {
        color: #28a745;
      }
      
      .declining {
        color: #dc3545;
      }
      
      .consistent {
        color: #6c757d;
      }
      
      .new {
        color: #0d6efd;
      }
    }
  }
  
  .improvement-advice {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    
    h6 {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-bottom: 15px;
      
      i {
        margin-right: 8px;
        color: #fd7e14;
      }
    }
    
    .advice-list {
      margin-bottom: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
        color: #495057;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.results-detail {
  margin-top: 20px;
  
  .detail-title {
    margin-bottom: 15px;
    font-weight: 600;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 10px;
  }
  
  .table {
    th {
      font-weight: 600;
      color: #495057;
    }
    
    .badge {
      font-weight: 500;
      padding: 5px 10px;
    }
  }
}

.dashboard-header {
  background: linear-gradient(45deg, #00CEC9, #20e3de);
  color: white;
  padding: 60px 0;
  position: relative;
  overflow: hidden;
  margin-top: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="%23FFFFFF" opacity="0.1"/></svg>');
    background-repeat: repeat;
    z-index: 0;
  }
  
  .container {
    position: relative;
    z-index: 1;
  }
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: fadeInDown 0.8s ease-out;
  }
  
  p {
    font-size: 1.4rem;
    margin-bottom: 0;
    opacity: 0.9;
    animation: fadeInUp 0.8s ease-out;
  }
}

.dashboard-content {
  padding: 60px 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 200px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -150px;
    right: -150px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(0,206,201,0.03);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -200px;
    left: -200px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(0,206,201,0.02);
    z-index: 0;
  }
  
  .container {
    position: relative;
    z-index: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Diagnostics styles */
.badge.bg-purple {
  background-color: #9b59b6 !important;
  color: white;
}

.badge.bg-purple-light {
  background-color: rgba(155, 89, 182, 0.2) !important;
  color: #9b59b6 !important;
}

.btn-purple {
  background-color: #9b59b6;
  border-color: #9b59b6;
  color: white;
}

.btn-purple:hover {
  background-color: #8e44ad;
  border-color: #8e44ad;
  color: white;
}

.diagnostic-exam-card {
  border-color: rgba(155, 89, 182, 0.1);
  
  &:hover {
    box-shadow: 0 12px 30px rgba(155, 89, 182, 0.12);
  }
  
  .diagnostic-icon {
    background: linear-gradient(45deg, rgba(155, 89, 182, 0.1), rgba(142, 68, 173, 0.1)) !important;
    color: #9b59b6 !important;
  }
  
  .diagnostic-imaging {
    background: linear-gradient(45deg, rgba(155, 89, 182, 0.15), rgba(155, 89, 182, 0.05)) !important;
  }
  
  .diagnostic-lab {
    background: linear-gradient(45deg, rgba(52, 152, 219, 0.15), rgba(52, 152, 219, 0.05)) !important;
    color: #3498db !important;
  }
  
  .diagnostic-ecg {
    background: linear-gradient(45deg, rgba(46, 204, 113, 0.15), rgba(46, 204, 113, 0.05)) !important;
    color: #2ecc71 !important;
  }
  
  .diagnostic-radiology {
    background: linear-gradient(45deg, rgba(243, 156, 18, 0.15), rgba(243, 156, 18, 0.05)) !important;
    color: #f39c12 !important;
  }
  
  .diagnostic-pathology {
    background: linear-gradient(45deg, rgba(231, 76, 60, 0.15), rgba(231, 76, 60, 0.05)) !important;
    color: #e74c3c !important;
  }
  
  .diagnostic-features {
    background-color: rgba(155, 89, 182, 0.05) !important;
  }
}

.manned-exam-card {
  border-color: rgba(23, 162, 184, 0.15);
  
  &:hover {
    box-shadow: 0 12px 30px rgba(23, 162, 184, 0.12);
  }
  
  .manned-icon {
    background: linear-gradient(45deg, rgba(23, 162, 184, 0.1), rgba(32, 201, 226, 0.1)) !important;
    color: #17a2b8 !important;
  }
  
  &.taken-exam {
    border-color: rgba(23, 162, 184, 0.2);
    
    .manned-icon {
      background: linear-gradient(45deg, rgba(40, 167, 69, 0.1), rgba(46, 204, 113, 0.1)) !important;
      color: #28a745 !important;
    }
  }
}



.dashboard-sidebar {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    padding: 20px;
    margin-bottom: 30px;
    
    .user-profile {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
      
      .profile-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .profile-info {
        h4 {
          margin-bottom: 5px;
          font-size: 1.1rem;
        }
        
        p {
          color: var(--gray-color);
          margin-bottom: 0;
          font-size: 0.9rem;
        }
      }
    }
    
    .sidebar-menu {
      .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: rgba(0,206,201,0.1);
        }
        
        &.active {
          background-color: var(--primary-color);
          color: white;
          
          .menu-icon {
            color: white;
          }
        }
        
        .menu-icon {
          font-size: 1.2rem;
          margin-right: 12px;
          color: var(--primary-color);
        }
        
        .menu-text {
          font-weight: 500;
        }
      }
    }
  }
  
  .dashboard-section {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    padding: 30px;
    margin-bottom: 30px;
    
    h2 {
      color: var(--primary-color);
      margin-bottom: 25px;
    }
    
    h3 {
      margin-top: 30px;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }
  }
  
  .stats-cards {
    margin-bottom: 30px;
    
    .stat-card {
      position: relative;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      padding: 25px;
      display: flex;
      align-items: center;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid rgba(240, 240, 240, 0.9);
      
      /* Color variations */
      &.stat-primary {
        .stat-icon {
          background: linear-gradient(45deg, rgba(0, 206, 201, 0.15), rgba(32, 227, 222, 0.15));
          color: var(--primary-color);
        }
        
        &:hover {
          border-color: rgba(0, 206, 201, 0.3);
        }
      }
      
      &.stat-success {
        .stat-icon {
          background: linear-gradient(45deg, rgba(40, 167, 69, 0.15), rgba(46, 204, 113, 0.15));
          color: #28a745;
        }
        
        .stat-value {
          color: #28a745;
        }
        
        &:hover {
          border-color: rgba(40, 167, 69, 0.3);
        }
      }
      
      &.stat-warning {
        .stat-icon {
          background: linear-gradient(45deg, rgba(253, 126, 20, 0.15), rgba(243, 156, 18, 0.15));
          color: #fd7e14;
        }
        
        .stat-value {
          color: #fd7e14;
        }
        
        &:hover {
          border-color: rgba(253, 126, 20, 0.3);
        }
      }
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      }
      
      /* Decorative pattern element */
      &:before {
        content: '';
        position: absolute;
        top: -50px;
        right: -50px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(240, 240, 240, 0.5);
        z-index: 0;
      }
      
      /* Icon styling */
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 15px;
        background: rgba(0, 206, 201, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        margin-right: 20px;
        flex-shrink: 0;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      
      /* Stat information */
      .stat-info {
        position: relative;
        z-index: 1;
        
        .stat-value {
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #333, #555);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .stat-label {
          color: #6c757d;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      }
    }
  }
  
  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-icon {
        background-color: rgba(0,206,201,0.1);
        color: var(--primary-color);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        margin-right: 15px;
      }
      
      .activity-details {
        .activity-title {
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .activity-time {
          font-size: 0.85rem;
          color: var(--gray-color);
        }
      }
    }
  }
  
  .class-list {
    .class-item {
      display: flex;
      padding: 15px;
      border-radius: 8px;
      background-color: rgba(0,206,201,0.05);
      margin-bottom: 15px;
      
      .class-date {
        background-color: var(--primary-color);
        color: white;
        border-radius: 8px;
        padding: 10px;
        text-align: center;
        min-width: 70px;
        margin-right: 15px;
        
        .date-day {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }
        
        .date-month {
          font-size: 0.9rem;
        }
      }
      
      .class-details {
        .class-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .class-time {
          font-size: 0.9rem;
          color: var(--gray-color);
          margin-bottom: 5px;
        }
        
        .class-instructor {
          font-size: 0.9rem;
        }
      }
    }
  }
  
  /* Modern courses grid layout */
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
  
  /* Modern course card styling */
  .course-card-modern {
    position: relative;
    overflow: hidden;
    height: 100%;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      
      .course-overlay {
        background: rgba(0, 0, 0, 0.7);
      }
      
      .course-img {
        transform: scale(1.05);
      }
    }
    
    .course-card-inner {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Image container with overlay */
    .course-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
      
      .course-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.7s ease;
      }
      
      /* Overlay with action button - always visible */
      .course-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition: background 0.3s ease;
        
        .course-action-btn {
          background: var(--primary-color);
          color: white;
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transform: translateY(0);
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          
          &:hover {
            transform: scale(1.05);
            background: var(--primary-hover);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
          
          i {
            font-size: 1.1rem;
          }
        }
      }
      
      /* Status ribbon */
      .course-status-ribbon {
        position: absolute;
        top: 20px;
        left: -5px;
        padding: 6px 15px;
        color: white;
        font-size: 0.8rem;
        font-weight: 600;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 6px;
        
        /* Different colors for different statuses */
        &.status-completed {
          background: linear-gradient(to right, #28a745, #2ecc71);
          
          &:after {
            border-top: 5px solid #1e7e34;
          }
        }
        
        &.status-in-progress {
          background: linear-gradient(to right, #fd7e14, #f39c12);
          
          &:after {
            border-top: 5px solid #c96a0c;
          }
        }
        
        &.status-not-started {
          background: linear-gradient(to right, #17a2b8, #3498db);
          
          &:after {
            border-top: 5px solid #117a8b;
          }
        }
        
        /* Triangle shape at bottom of ribbon */
        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0;
          height: 0;
          border-right: 5px solid transparent;
          z-index: -1;
        }
        
        /* Icon styling */
        i {
          font-size: 0.9rem;
        }
      }
    }
    
    /* Course information section */
    .course-info {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      
      .course-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.3;
      }
      
      .course-meta {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
        
        .course-category, .course-type {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 15px;
          font-weight: 500;
        }
        
        .course-category {
          background-color: rgba(0, 206, 201, 0.1);
          color: var(--primary-color);
        }
        
        .course-type {
          background-color: rgba(108, 117, 125, 0.1);
          color: #6c757d;
        }
      }
      
      .course-description {
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 20px;
        flex-grow: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
      }
      
      /* Modern progress bar styling */
      .course-progress-wrapper {
        margin-top: auto;
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          
          .progress-label {
            font-size: 0.85rem;
            color: #6c757d;
            font-weight: 500;
          }
          
          .progress-percentage {
            font-size: 0.85rem;
            font-weight: 700;
            color: #6c757d;
            
            &.complete {
              color: #28a745;
            }
          }
        }
        
        .progress-bar-container {
          margin-bottom: 10px;
          
          .progress-track {
            height: 6px;
            background-color: #f1f1f1;
            border-radius: 10px;
            overflow: hidden;
            
            .progress-fill {
              height: 100%;
              border-radius: 10px;
              transition: width 0.5s ease;
              
              &.status-completed {
                background: linear-gradient(to right, #28a745, #2ecc71);
              }
              
              &.status-in-progress {
                background: linear-gradient(to right, #fd7e14, #f39c12);
              }
              
              &.status-not-started {
                background: var(--primary-color);
              }
            }
          }
        }
        
        .completion-info {
          font-size: 0.8rem;
          color: #28a745;
          display: flex;
          align-items: center;
          gap: 5px;
          
          i {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
  
  /* Legacy course card styling - keep for backward compatibility */
  .course-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    height: 100%;
  }
  
  .exam-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    padding: 20px;
    display: flex;
    height: 100%;
    
    .exam-icon {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-right: 20px;
    }
    
    .exam-content {
      flex: 1;
      
      h3 {
        font-size: 1.25rem;
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      p {
        color: var(--gray-color);
        margin-bottom: 15px;
        font-size: 0.9rem;
      }
      
      .exam-meta {
        display: flex;
        gap: 15px;
        
        span {
          font-size: 0.9rem;
          
          i {
            margin-right: 5px;
            color: var(--primary-color);
          }
        }
      }
    }
  }
  
  .no-exams-message {
    .no-data-icon {
      font-size: 3rem;
      color: #dee2e6;
      margin-bottom: 1rem;
    }
    
    h3 {
      color: #495057;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
  }
  
  .profile-image-large {
    text-align: center;
    margin-bottom: 30px;
    
    img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 15px;
    }
    
    .change-photo-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      
      i {
        margin-right: 5px;
      }
    }
  }
  
  .subscription-status {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .badge {
      padding: 8px 12px;
    }
  }
  
  .category-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.1);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 8px;
      height: 100%;
      background: var(--primary-color);
      box-shadow: 0 0 15px rgba(0, 206, 201, 0.5);
    }
    
    .category-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: rgba(0, 206, 201, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      color: var(--primary-color);
      margin-right: 16px;
    }
    
    .category-details {
      flex: 1;
      
      .category-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      
      .category-description {
        font-size: 0.85rem;
        color: #7f8c8d;
        max-width: 220px;
      }
    }
    
    .category-badge {
      padding: 6px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      
      &.nurse {
        background-color: #e3f2fd;
        color: #0d6efd;
      }
      
      &.pa {
        background-color: #e8f5e9;
        color: #28a745;
      }
      
      &.student {
        background-color: #fff8e1;
        color: #ffc107;
      }
      
      &.doctor {
        background-color: #f3e5f5;
        color: #9c27b0;
      }
      
      &.exam {
        background-color: #e0f7fa;
        color: #00bcd4;
      }
      
      &.default {
        background-color: #f1f1f1;
        color: #6c757d;
      }
    }
  }
  
  .category-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    font-size: 0.85rem;
    color: #7f8c8d;
    
    i {
      color: var(--primary-color);
    }
  }
  
  // Settings page styles
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  
  .settings-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .settings-header {
      display: flex;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: relative;
      
      .settings-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(0, 206, 201, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: var(--primary-color);
        margin-right: 16px;
        
        &.subscription-icon {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: white;
        }
      }
      
      .settings-title {
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #2c3e50;
        }
        
        p {
          font-size: 0.85rem;
          color: #7f8c8d;
          margin: 0;
        }
      }
      
      .subscription-badge {
        position: absolute;
        right: 20px;
        top: 20px;
        background: linear-gradient(45deg, #6a11cb, #2575fc);
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 700;
        box-shadow: 0 4px 10px rgba(106, 17, 203, 0.2);
      }
    }
    
    .settings-body {
      padding: 20px;
    }
    
    .settings-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      
      .settings-item-info {
        h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #2c3e50;
        }
        
        p {
          font-size: 0.85rem;
          color: #7f8c8d;
          margin: 0;
        }
      }
    }
  }
  
  // Toggle Switch Styles
  .toggle-switch {
    position: relative;
    
    input[type="checkbox"] {
      height: 0;
      width: 0;
      visibility: hidden;
      position: absolute;
    }
    
    label {
      cursor: pointer;
      width: 50px;
      height: 26px;
      background: #bdc3c7;
      display: inline-block;
      border-radius: 50px;
      position: relative;
      transition: all 0.3s ease;
      
      &:after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
    }
    
    input:checked + label {
      background: var(--primary-color);
    }
    
    input:checked + label:after {
      left: calc(100% - 3px);
      transform: translateX(-100%);
    }
  }
  
  // Theme Buttons
  .theme-toggle {
    display: flex;
    gap: 8px;
    
    .theme-btn {
      padding: 8px 15px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      background: white;
      color: #2c3e50;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.3s ease;
      
      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
      
      &:hover:not(.active) {
        background: #f5f5f5;
      }
    }
  }
  
  // Font Size Buttons
  .font-size-selector {
    display: flex;
    gap: 8px;
    
    .font-size-btn {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      background: white;
      color: #2c3e50;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:nth-child(1) {
        font-size: 0.8rem;
      }
      
      &:nth-child(2) {
        font-size: 1rem;
      }
      
      &:nth-child(3) {
        font-size: 1.2rem;
      }
      
      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
      
      &:hover:not(.active) {
        background: #f5f5f5;
      }
    }
  }
  
  // Subscription Info
  .subscription-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(45deg, rgba(106, 17, 203, 0.05), rgba(37, 117, 252, 0.05));
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    
    .subscription-details {
      .subscription-type {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .subscription-period {
        font-size: 0.9rem;
        color: #2c3e50;
        margin-bottom: 3px;
      }
      
      .subscription-date {
        font-size: 0.85rem;
        color: #7f8c8d;
      }
    }
    
    .subscription-price {
      text-align: right;
      
      .amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
      }
      
      .period {
        font-size: 0.85rem;
        color: #7f8c8d;
      }
    }
  }
  
  .subscription-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      
      i {
        color: var(--primary-color);
        font-size: 1.1rem;
      }
    }
  }
  
  .subscription-actions {
    display: flex;
    gap: 15px;
    
    .btn {
      flex: 1;
    }
  }
  
  .settings-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    
    .btn {
      min-width: 150px;
    }
  }
  
  @media (max-width: 768px) {
    .subscription-info {
      flex-direction: column;
      gap: 15px;
      text-align: center;
      
      .subscription-price {
        text-align: center;
      }
    }
    
    .subscription-features {
      grid-template-columns: 1fr;
    }
    
    .subscription-actions {
      flex-direction: column;
    }
  }
  
  // Non-scoped global styles for toast notifications
  :global(.settings-toast) {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 25px;
    border-radius: 30px;
    font-size: 0.9rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    
    &.visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  // SCSS variables for applying theme and font size directly to :root
  :global(:root) {
    --bg-color: #f5f7fa;
    --text-color: #2c3e50;
    --card-bg: #ffffff;
    --border-color: #e0e0e0;
    --primary-color: #00CEC9;
    --primary-hover: #00dad5;
    --card-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    --root-font-size: 16px;
    --paragraph-size: 1rem;
    --heading-scale: 1.2;
    --transition-speed: 0.3s;
  }
  
  /* Apply global styles outside of scoped CSS */
  ::v-deep {
    .dashboard-page {
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
      position: relative;
      z-index: 1;
      padding-top: 0; /* Remove padding as it's already provided by main in App.vue */
    }
    
    .dashboard-section {
      background: var(--card-bg);
      color: var(--text-color);
      box-shadow: var(--card-shadow);
      border: 1px solid var(--border-color);
      transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease, 
                  box-shadow var(--transition-speed) ease, border-color var(--transition-speed) ease;
    }
  }
  
  :global(body.theme-dark) {
    --bg-color: #121212;
    --text-color: #ffffff;
    --card-bg: #1e1e1e;
    --border-color: #333333;
    --primary-hover: #00b3b0;
    --card-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    
    .dashboard-page {
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .dashboard-content {
      background-color: var(--bg-color);
    }
    
    .dashboard-section, .settings-card {
      background: var(--card-bg);
      border-color: var(--border-color);
      box-shadow: var(--card-shadow);
    }
    
    .category-card {
      background: linear-gradient(145deg, #1a1a1a, #222222);
    }
    
    .category-info, .settings-item-info p {
      color: #aaa;
    }
    
    .settings-item {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .settings-item-info h4, h2, h3 {
      color: var(--text-color);
    }
    
    .theme-btn, .font-size-btn {
      background: #2a2a2a;
      border-color: #444;
      color: #ddd;
      
      &:hover:not(.active) {
        background: #333;
      }
    }
    
    .subscription-info {
      background: linear-gradient(45deg, rgba(106, 17, 203, 0.1), rgba(37, 117, 252, 0.1));
    }
    
    .feature-item {
      color: #ddd;
    }
  }
  
  /* Font size classes */
  :global(body.font-small) {
    --root-font-size: 14px;
    --paragraph-size: 0.9rem;
    --heading-scale: 1.1;
    
    p, .settings-item-info p, .category-description, .category-info {
      font-size: var(--paragraph-size);
    }
    
    h1, h2, h3, h4, h5, h6, .category-name, .settings-item-info h4 {
      transform: scale(var(--heading-scale));
    }
    
    .dashboard-section h2 {
      font-size: 1.4rem;
    }
    
    .settings-item-info h4 {
      font-size: 0.9rem;
    }
  }
  
  :global(body.font-medium) {
    --root-font-size: 16px;
    --paragraph-size: 1rem;
    --heading-scale: 1.2;
    
    p, .settings-item-info p, .category-description, .category-info {
      font-size: var(--paragraph-size);
    }
  }
  
  :global(body.font-large) {
    --root-font-size: 18px;
    --paragraph-size: 1.1rem;
    --heading-scale: 1.3;
    
    p, .settings-item-info p, .category-description, .category-info {
      font-size: var(--paragraph-size);
    }
    
    h1, h2, h3, h4, h5, h6, .category-name, .settings-item-info h4 {
      transform: scale(var(--heading-scale));
    }
    
    .dashboard-section h2 {
      font-size: 1.8rem;
    }
    
    .settings-item-info h4 {
      font-size: 1.1rem;
    }
  }
  
  /* Animations toggle */
  :global(body.no-animations) {
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
    
    .settings-toast {
      transition: none !important;
    }
  }
  
  /* Activity List Styles */
  .recent-activities {
    margin-bottom: 30px;
    
    h3 {
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .empty-activities {
      text-align: center;
      padding: 30px 0;
      
      .empty-state-icon {
        font-size: 3rem;
        color: #e0e0e0;
        margin-bottom: 15px;
      }
      
      h4 {
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      p {
        color: #6c757d;
      }
    }
    
    .activity-list {
      margin-top: 15px;
      
      .activity-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        h5 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
        }
        
        .activity-actions {
          display: flex;
          gap: 10px;
        }
      }
      
      .activity-item {
        display: flex;
        align-items: flex-start;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 10px;
        border: 1px solid var(--border-color);
        transition: all 0.2s ease;
        background: var(--card-bg);
        
        &:hover {
          background: rgba(0, 206, 201, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        &.new-activity {
          border: 1px solid var(--primary-color);
          background: rgba(0, 206, 201, 0.1);
          animation: pulse 2s infinite;
        }
        
        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
          
          i {
            font-size: 1.2rem;
          }
        }
        
        .activity-details {
          flex: 1;
          
          .activity-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--text-color);
          }
          
          .activity-meta {
            font-size: 0.85rem;
            color: #6c757d;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .activity-time {
            font-size: 0.8rem;
            color: #adb5bd;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  /* Pulse animation for new activities */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 206, 201, 0.4);
    }
    70% {
      box-shadow: 0 0 0 5px rgba(0, 206, 201, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 206, 201, 0);
    }
  }
  
  // Enhanced styling for exam cards
  // Modal styles for custom modal
  .modal {
    &.show {
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
    
    .modal-content {
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .exam-results-header {
      background: linear-gradient(45deg, #17a2b8, #00CEC9);
      color: white;
      border-bottom: none;
      padding: 1.2rem;
      
      .modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        
        i {
          margin-right: 8px;
        }
      }
      
      .btn-close {
        color: white;
        opacity: 0.8;
        filter: brightness(5);
        
        &:hover {
          opacity: 1;
        }
      }
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .result-stat {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      height: 100%;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      &.good {
        background-color: rgba(40, 167, 69, 0.1);
        border-left: 3px solid #28a745;
      }
      
      &.attempts {
        background-color: rgba(23, 162, 184, 0.1);
        border-left: 3px solid #17a2b8;
      }
      
      .stat-label {
        color: #6c757d;
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      
      .stat-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #343a40;
      }
    }
    
    .performance-trend {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      
      .trend-label {
        color: #6c757d;
        margin-bottom: 10px;
      }
      
      .trend-value {
        font-size: 1.1rem;
        font-weight: 600;
        
        .improving {
          color: #28a745;
        }
        
        .declining {
          color: #dc3545;
        }
        
        .consistent {
          color: #ffc107;
        }
        
        .new {
          color: #17a2b8;
        }
        
        i {
          margin-right: 5px;
        }
      }
    }
    
    .improvement-advice {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      
      h6 {
        color: #343a40;
        margin-bottom: 15px;
        
        i {
          color: #ffc107;
          margin-right: 5px;
        }
      }
      
      .advice-list {
        padding-left: 20px;
        margin-bottom: 0;
        
        li {
          margin-bottom: 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    
    .results-detail {
      .detail-title {
        color: #343a40;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9ecef;
      }
      
      .table {
        margin-bottom: 0;
        
        th {
          background-color: #f8f9fa;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        td {
          vertical-align: middle;
        }
      }
    }
    
    .modal-footer {
      border-top: 1px solid #e9ecef;
      padding: 1.2rem;
    }
  }

  .exam-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
    height: 100%;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border-left: 5px solid var(--primary-color);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    &.taken-exam {
      border-left: 5px solid #ffc107;
      background: linear-gradient(to right, rgba(255, 248, 230, 0.3), white);
    }
    
    .exam-status-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #ffc107;
      color: rgba(0, 0, 0, 0.7);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
      
      i {
        margin-right: 5px;
      }
    }
    
    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .exam-icon {
        width: 60px;
        height: 60px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.8rem;
        box-shadow: 0 4px 8px rgba(0, 206, 201, 0.3);
        
        .taken-exam & {
          background: #ffc107;
          box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
        }
      }
      
      .exam-type-badge {
        background: rgba(0, 206, 201, 0.1);
        color: var(--primary-color);
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 1px;
        
        .taken-exam & {
          background: rgba(255, 193, 7, 0.1);
          color: #e6a800;
        }
      }
    }
    
    .exam-content {
      h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: #333;
      }
      
      p {
        color: #6c757d;
        font-size: 0.95rem;
        margin-bottom: 15px;
        line-height: 1.5;
      }
      
      .exam-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
        
        span {
          background: #f5f7fa;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #495057;
          font-weight: 500;
          
          &.attempt-date {
            background: rgba(40, 167, 69, 0.1);
            border: 1px dashed rgba(40, 167, 69, 0.3);
          }
          
          i {
            color: var(--primary-color);
            
            .attempt-date & {
              color: #28a745;
            }
            margin-right: 5px;
            
            .taken-exam & {
              color: #ffc107;
            }
          }
        }
      }
      
      .exam-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .btn {
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
          }
          
          &.btn-primary {
            box-shadow: 0 4px 12px rgba(0, 206, 201, 0.3);
          }
          
          &.btn-outline-warning {
            border-color: #ffc107;
            color: #e6a800;
            background: white;
            
            &:hover {
              background: rgba(255, 193, 7, 0.1);
            }
          }
          
          &.btn-outline-info {
            border-color: #17a2b8;
            color: #17a2b8;
            
            &:hover {
              background: rgba(23, 162, 184, 0.1);
            }
          }
        }
      }
    }
  }

  /* Face Verification Notices */
  .face-verification-notice,
  .face-setup-notice {
    margin-bottom: 30px;
    
    .verification-alert,
    .setup-alert {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 30px;
      color: white;
      text-align: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      
      .alert-icon {
        font-size: 3rem;
        margin-bottom: 15px;
        opacity: 0.9;
      }
      
      .alert-content {
        h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        p {
          font-size: 1.1rem;
          margin-bottom: 25px;
          opacity: 0.9;
          line-height: 1.5;
        }
        
        .verification-btn,
        .setup-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 30px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 25px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          i {
            margin-right: 8px;
          }
        }
        
        .setup-btn {
          background: linear-gradient(45deg, #28a745, #20c997);
          border-color: transparent;
          
          &:hover {
            background: linear-gradient(45deg, #218838, #1ea080);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  .face-setup-notice .setup-alert {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
  }
  
  /* Face Status Loading */
  .face-status-loading {
    text-align: center;
    padding: 40px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    margin-bottom: 30px;
    
    .loading-spinner {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 15px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    p {
      color: #6c757d;
      font-size: 1.1rem;
      margin: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  </style>
  
