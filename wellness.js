// Wellness Widget System
const exercises = {
    meditation: [
        {
            name: 'Mindful Breathing',
            duration: 300,
            description: 'Focus on your breath to calm your mind',
            steps: [
                'Sit comfortably with your back straight',
                'Close your eyes gently',
                'Breathe in slowly through your nose for 4 counts',
                'Hold for 4 counts',
                'Exhale slowly through your mouth for 6 counts',
                'Repeat this cycle, focusing only on your breath'
            ],
            benefits: 'Reduces stress, improves focus, lowers blood pressure'
        },
        {
            name: 'Body Scan',
            duration: 600,
            description: 'Progressive relaxation through body awareness',
            steps: [
                'Lie down or sit comfortably',
                'Close your eyes and take 3 deep breaths',
                'Focus on your toes, notice any tension',
                'Slowly move attention up through feet, legs, torso',
                'Continue through arms, neck, and head',
                'Release tension in each area as you go'
            ],
            benefits: 'Releases physical tension, improves sleep, enhances body awareness'
        },
        {
            name: 'Loving Kindness',
            duration: 420,
            description: 'Cultivate compassion for yourself and others',
            steps: [
                'Sit comfortably and close your eyes',
                'Think of someone you love deeply',
                'Silently repeat: "May you be happy, may you be healthy"',
                'Extend this feeling to yourself',
                'Then to a neutral person, then to all beings',
                'Feel warmth and compassion spreading'
            ],
            benefits: 'Increases empathy, reduces negative emotions, improves relationships'
        }
    ],
    breathing: [
        {
            name: '4-7-8 Breathing',
            duration: 240,
            description: 'Natural tranquilizer for the nervous system',
            steps: [
                'Sit with your back straight',
                'Place tongue behind upper front teeth',
                'Exhale completely through mouth',
                'Inhale through nose for 4 counts',
                'Hold breath for 7 counts',
                'Exhale through mouth for 8 counts',
                'Repeat 4 times'
            ],
            benefits: 'Reduces anxiety, helps with sleep, manages stress response'
        },
        {
            name: 'Box Breathing',
            duration: 300,
            description: 'Used by Navy SEALs for stress management',
            steps: [
                'Sit upright in a comfortable position',
                'Exhale all air from your lungs',
                'Inhale through nose for 4 counts',
                'Hold your breath for 4 counts',
                'Exhale through mouth for 4 counts',
                'Hold empty for 4 counts',
                'Repeat for 5 minutes'
            ],
            benefits: 'Improves focus, regulates nervous system, enhances performance'
        },
        {
            name: 'Alternate Nostril',
            duration: 360,
            description: 'Ancient yogic breathing technique',
            steps: [
                'Sit comfortably with spine straight',
                'Use right thumb to close right nostril',
                'Inhale slowly through left nostril',
                'Close left nostril with ring finger',
                'Release right nostril and exhale',
                'Inhale through right, switch, exhale left',
                'Continue alternating for 6 minutes'
            ],
            benefits: 'Balances brain hemispheres, reduces stress, improves lung function'
        }
    ],
    stretch: [
        {
            name: 'Desk Stretch Routine',
            duration: 300,
            description: 'Quick stretches for office workers',
            steps: [
                'Neck Rolls: Sit tall, drop chin to chest, slowly roll head in circles - 10 each direction',
                'Shoulder Shrugs: Lift shoulders to ears, hold 2 seconds, release - repeat 10 times',
                'Wrist Circles: Extend arms, rotate wrists in circles - 10 each direction',
                'Seated Spinal Twist: Sit sideways in chair, hold backrest, twist gently - 30 seconds each side',
                'Forward Fold: Stand, hinge at hips, reach for toes (bend knees if needed) - hold 30 seconds',
                'Side Stretches: Stand, reach one arm overhead, lean to opposite side - 20 seconds each'
            ],
            benefits: 'Reduces muscle tension, improves posture, prevents stiffness'
        },
        {
            name: 'Morning Energizer',
            duration: 420,
            description: 'Wake up your body and mind',
            steps: [
                'Cat-Cow: On hands and knees, arch back (cow), then round spine (cat) - 10 slow rounds',
                'Downward Dog: Hands and feet on floor, lift hips high forming inverted V - hold 30 seconds',
                'Standing Forward Bend: Stand tall, hinge at hips, let arms hang toward floor - 30 seconds',
                'Lunges: Step one foot forward, lower back knee toward floor, keep front knee over ankle - 30 seconds each leg',
                'Arm Circles: Extend arms to sides, make large circles - 20 forward, 20 backward',
                'Gentle Backbend: Stand, place hands on lower back, gently arch backward - 20 seconds'
            ],
            benefits: 'Increases energy, improves flexibility, boosts circulation'
        },
        {
            name: 'Evening Wind Down',
            duration: 480,
            description: 'Gentle stretches before bed',
            steps: [
                'Seated Forward Fold: Sit with legs extended, hinge at hips, reach toward toes - 1 minute',
                'Butterfly Stretch: Sit, bring soles of feet together, let knees fall to sides, gently press knees down - 1 minute',
                'Supine Twist: Lie on back, drop both knees to one side, extend arms in T-shape - 1 minute each side',
                'Legs Up the Wall: Lie on back with legs extended up against wall, arms relaxed at sides - 2 minutes',
                'Child\'s Pose: Kneel, sit back on heels, extend arms forward, rest forehead on floor - 1 minute',
                'Corpse Pose: Lie flat on back, arms at sides palms up, close eyes, breathe deeply - 2 minutes'
            ],
            benefits: 'Promotes relaxation, improves sleep quality, releases daily tension'
        }
    ]
};

let wellnessMenuOpen = false;
let exerciseTimer = null;
let timerInterval = null;

function initWellnessWidget() {
    const widget = document.createElement('div');
    widget.id = 'wellness-widget';
    widget.innerHTML = `
        <button id="wellness-btn" onclick="toggleWellnessMenu()" style="
            position: fixed;
            bottom: 120px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
            z-index: 999;
            transition: all 0.3s ease;
        ">+</button>
        
        <div id="wellness-menu" style="
            position: fixed;
            bottom: 190px;
            left: 20px;
            background: rgba(30, 41, 59, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 1rem;
            display: none;
            z-index: 998;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            min-width: 220px;
        ">
            <div style="margin-bottom: 0.5rem; color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Quick Log</div>
            <button onclick="logEntry('symptom')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); border-left: 3px solid #ef4444;">🩺 Symptom</button>
            <button onclick="logEntry('meal')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); border-left: 3px solid #f59e0b;">🍽️ Meal</button>
            <button onclick="logEntry('mood')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); border-left: 3px solid #8b5cf6;">😊 Mood</button>
            <button onclick="logEntry('workout')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); border-left: 3px solid #10b981;">💪 Workout</button>
            
            <div style="margin: 1rem 0 0.5rem; color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">Exercises</div>
            <button onclick="showExercises('meditation')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25)); border-left: 3px solid #6366f1;">🧘 Meditation</button>
            <button onclick="showExercises('breathing')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25)); border-left: 3px solid #0ea5e9;">🌬️ Breathing</button>
            <button onclick="showExercises('stretch')" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25)); border-left: 3px solid #ec4899;">🤸 Stretch</button>
            
            <div style="margin: 1rem 0 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;"></div>
            <button onclick="viewWellnessHistory()" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.25)); border-left: 3px solid #8b5cf6;">📊 History</button>
            <button onclick="openHealthDiary()" class="wellness-menu-btn" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.25)); border-left: 3px solid #ec4899;">📖 Health Diary</button>
        </div>
    `;
    document.body.appendChild(widget);
    
    const style = document.createElement('style');
    style.textContent = `
        .wellness-menu-btn {
            width: 100%;
            padding: 0.75rem;
            margin: 0.25rem 0;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            text-align: left;
        }
        .wellness-menu-btn:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        #wellness-btn:hover {
            transform: scale(1.1) rotate(90deg);
        }
        @media (max-width: 1024px) {
            #wellness-btn {
                bottom: 200px !important;
            }
            #wellness-menu {
                bottom: 210px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

window.toggleWellnessMenu = function() {
    wellnessMenuOpen = !wellnessMenuOpen;
    const menu = document.getElementById('wellness-menu');
    const btn = document.getElementById('wellness-btn');
    menu.style.display = wellnessMenuOpen ? 'block' : 'none';
    btn.style.transform = wellnessMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)';
}

window.logEntry = async function(type) {
    const icons = { symptom: '🩺', meal: '🍽️', mood: '😊', workout: '💪' };
    const colors = { symptom: '#ef4444', meal: '#f59e0b', mood: '#8b5cf6', workout: '#10b981' };
    
    const { value: text } = await Swal.fire({
        title: `${icons[type]} Log ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        input: 'textarea',
        inputPlaceholder: `Describe your ${type}...`,
        showCancelButton: true,
        confirmButtonText: 'Save',
        confirmButtonColor: colors[type],
        inputValidator: (value) => !value && 'Please enter something'
    });
    
    if (text) {
        const entry = {
            type,
            text,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        const logs = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
        logs.unshift(entry);
        localStorage.setItem('wellness_logs', JSON.stringify(logs));
        
        Swal.fire({
            icon: 'success',
            title: 'Logged!',
            text: `Your ${type} has been saved`,
            timer: 2000,
            showConfirmButton: false
        });
        
        toggleWellnessMenu();
    }
}

window.showExercises = function(category) {
    const categoryIcons = { meditation: '🧘', breathing: '🌬️', stretch: '🤸' };
    const exerciseList = exercises[category];
    
    Swal.fire({
        title: `${categoryIcons[category]} ${category.charAt(0).toUpperCase() + category.slice(1)} Exercises`,
        html: `
            <div style="text-align: left;">
                ${exerciseList.map((ex, i) => `
                    <div onclick="startExercise('${category}', ${i})" style="
                        padding: 1rem;
                        margin: 0.5rem 0;
                        background: rgba(16, 185, 129, 0.1);
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: 1px solid rgba(16, 185, 129, 0.2);
                    " onmouseover="this.style.background='rgba(16, 185, 129, 0.2)'" onmouseout="this.style.background='rgba(16, 185, 129, 0.1)'">
                        <div style="font-weight: 600; color: #10b981; margin-bottom: 0.25rem;">${ex.name}</div>
                        <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.25rem;">${ex.description}</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">⏱️ ${Math.floor(ex.duration / 60)} min</div>
                    </div>
                `).join('')}
            </div>
        `,
        width: '600px',
        showConfirmButton: false,
        showCloseButton: true
    });
    
    toggleWellnessMenu();
}

window.startExercise = function(category, index) {
    const exercise = exercises[category][index];
    
    Swal.fire({
        title: exercise.name,
        html: `
            <div style="text-align: left;">
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div style="font-weight: 600; color: #10b981; margin-bottom: 0.5rem;">Benefits</div>
                    <div style="color: #94a3b8; font-size: 0.9rem;">${exercise.benefits}</div>
                </div>
                
                <div style="font-weight: 600; color: #fff; margin-bottom: 0.75rem;">Instructions:</div>
                <ol style="color: #94a3b8; padding-left: 1.5rem; line-height: 1.8;">
                    ${exercise.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
                
                <div style="text-align: center; margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem;">Duration</div>
                    <div style="font-size: 2rem; font-weight: 700; color: #3b82f6;">${Math.floor(exercise.duration / 60)}:${(exercise.duration % 60).toString().padStart(2, '0')}</div>
                </div>
            </div>
        `,
        width: '700px',
        showCancelButton: true,
        confirmButtonText: '▶️ Start Timer',
        cancelButtonText: 'Close',
        confirmButtonColor: '#10b981'
    }).then((result) => {
        if (result.isConfirmed) {
            startTimer(exercise);
        }
    });
}

window.startTimer = function(exercise) {
    let timeLeft = exercise.duration;
    let isPaused = false;
    
    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    Swal.fire({
        title: exercise.name,
        html: `
            <div style="text-align: center;">
                <div id="timer-display" style="
                    font-size: 5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #10b981, #3b82f6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 2rem 0;
                ">${updateTimer()}</div>
                
                <div id="timer-progress" style="
                    width: 100%;
                    height: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                ">
                    <div id="progress-bar" style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, #10b981, #3b82f6);
                        transition: width 1s linear;
                    "></div>
                </div>
                
                <div style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6;">
                    ${exercise.steps[0]}
                </div>
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '⏸️ Pause',
        denyButtonText: '⏹️ Stop',
        cancelButtonText: 'Close',
        allowOutsideClick: false,
        didOpen: () => {
            timerInterval = setInterval(() => {
                if (!isPaused && timeLeft > 0) {
                    timeLeft--;
                    document.getElementById('timer-display').textContent = updateTimer();
                    const progress = (timeLeft / exercise.duration) * 100;
                    document.getElementById('progress-bar').style.width = progress + '%';
                    
                    if (timeLeft === 0) {
                        clearInterval(timerInterval);
                        Swal.fire({
                            icon: 'success',
                            title: 'Complete! 🎉',
                            text: `You finished ${exercise.name}`,
                            confirmButtonText: 'Done'
                        });
                        
                        const log = {
                            type: 'exercise',
                            text: `Completed ${exercise.name}`,
                            timestamp: Date.now(),
                            date: new Date().toISOString()
                        };
                        const logs = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
                        logs.unshift(log);
                        localStorage.setItem('wellness_logs', JSON.stringify(logs));
                    }
                }
            }, 1000);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            isPaused = !isPaused;
            Swal.getConfirmButton().textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
        } else if (result.isDenied) {
            clearInterval(timerInterval);
            Swal.fire('Stopped', 'Exercise stopped', 'info');
        }
    });
}

window.viewWellnessLogs = function() {
    const logs = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
    const icons = { symptom: '🩺', meal: '🍽️', mood: '😊', workout: '💪', exercise: '🏃' };
    
    Swal.fire({
        title: 'Wellness Logs',
        html: logs.length > 0 ? `
            <div style="max-height: 500px; overflow-y: auto; text-align: left;">
                ${logs.map((log, i) => `
                    <div style="
                        padding: 1rem;
                        margin: 0.5rem 0;
                        background: rgba(30, 41, 59, 0.4);
                        border-radius: 12px;
                        border-left: 4px solid #10b981;
                    ">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600; color: #10b981;">${icons[log.type]} ${log.type.toUpperCase()}</span>
                            <span style="font-size: 0.75rem; color: #6b7280;">${new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div style="color: #94a3b8; font-size: 0.9rem;">${log.text}</div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="color: #6b7280; padding: 2rem;">No logs yet. Start tracking your wellness!</p>',
        width: '700px',
        confirmButtonText: 'Close'
    });
}

window.viewWellnessHistory = async function() {
    const logs = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
    const icons = { symptom: '🩺', meal: '🍽️', mood: '😊', workout: '💪', exercise: '🏃' };
    const colors = { symptom: '#ef4444', meal: '#f59e0b', mood: '#8b5cf6', workout: '#10b981', exercise: '#3b82f6' };
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const thisWeek = logs.filter(l => Date.now() - l.timestamp < 604800000);
    
    const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === today);
    const yesterdayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === yesterday);
    
    let aiInsights = '<div style="padding: 1rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.2)); border-radius: 10px; border-left: 3px solid #3b82f6; margin-bottom: 1.5rem;"><div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;"><span style="font-size: 1.25rem;">🤖</span><span style="font-weight: 600; color: #3b82f6;">AI Health Insights</span></div><div style="color: #94a3b8; font-size: 0.85rem;">Analyzing your wellness data...</div></div>';
    
    if (logs.length >= 3) {
        setTimeout(async () => {
            try {
                const analysis = await analyzeWellnessLogs(logs.slice(0, 20));
                document.getElementById('ai-insights-section').innerHTML = `
                    <div style="padding: 1rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.2)); border-radius: 10px; border-left: 3px solid #3b82f6;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="font-size: 1.25rem;">🤖</span>
                            <span style="font-weight: 600; color: #3b82f6;">AI Health Insights</span>
                        </div>
                        <div style="color: #cbd5e1; font-size: 0.875rem; line-height: 1.6; white-space: pre-line;">${analysis}</div>
                    </div>
                `;
            } catch (error) {
                document.getElementById('ai-insights-section').innerHTML = '';
            }
        }, 500);
    } else {
        aiInsights = '';
    }
    
    Swal.fire({
        title: 'Wellness History',
        html: `
            <div style="text-align: left;">
                <div id="ai-insights-section">${aiInsights}</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                    <div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-radius: 8px; text-align: center; border-left: 3px solid #10b981;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${todayLogs.length}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Today</div>
                    </div>
                    <div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)); border-radius: 8px; text-align: center; border-left: 3px solid #3b82f6;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${yesterdayLogs.length}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Yesterday</div>
                    </div>
                    <div style="padding: 0.75rem; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.2)); border-radius: 8px; text-align: center; border-left: 3px solid #8b5cf6;">
                        <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">${thisWeek.length}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">This Week</div>
                    </div>
                </div>
                
                ${logs.length > 0 ? `
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${logs.slice(0, 20).map((log, i) => {
                            const date = new Date(log.timestamp);
                            const isToday = date.toDateString() === today;
                            const isYesterday = date.toDateString() === yesterday;
                            const timeLabel = isToday ? 'Today' : isYesterday ? 'Yesterday' : date.toLocaleDateString();
                            
                            return `
                                <div style="
                                    padding: 0.875rem;
                                    margin: 0.5rem 0;
                                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.3), rgba(30, 41, 59, 0.5));
                                    border-radius: 10px;
                                    border-left: 3px solid ${colors[log.type]};
                                    transition: all 0.2s ease;
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span style="font-size: 1.25rem;">${icons[log.type]}</span>
                                            <span style="font-weight: 600; color: ${colors[log.type]}; font-size: 0.85rem; text-transform: uppercase;">${log.type}</span>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-size: 0.7rem; color: #94a3b8;">${timeLabel}</div>
                                            <div style="font-size: 0.65rem; color: #6b7280;">${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                        </div>
                                    </div>
                                    <div style="color: #cbd5e1; font-size: 0.875rem; line-height: 1.5;">${log.text}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<p style="color: #6b7280; padding: 2rem; text-align: center;">No history yet. Start logging your wellness activities!</p>'}
            </div>
        `,
        width: '650px',
        confirmButtonText: 'Close',
        confirmButtonColor: '#10b981'
    });
    
    toggleWellnessMenu();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWellnessWidget);
} else {
    initWellnessWidget();
}


// AI Wellness Analysis
async function analyzeWellnessLogs(logs) {
    const GEMINI_API_KEY = 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';
    
    const logSummary = logs.map(l => {
        const date = new Date(l.timestamp).toLocaleDateString();
        return `${date} - ${l.type.toUpperCase()}: ${l.text}`;
    }).join('\n');
    
    const prompt = `You are a health and wellness AI assistant. Analyze these wellness logs and provide personalized health insights:

${logSummary}

Provide:
1. Overall health assessment (2-3 sentences)
2. Specific concerns or patterns noticed
3. Dietary recommendations if meals are logged
4. Exercise suggestions if workouts are logged
5. Mental health tips if mood/symptoms are logged

Keep response concise (max 200 words), actionable, and encouraging. Use bullet points.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('AI analysis error:', error);
        return 'Unable to generate insights at this time. Keep logging your wellness activities!';
    }
}


// Health Diary System
let currentDiaryEntry = null;
let autoSaveInterval = null;

window.openHealthDiary = function() {
    const password = localStorage.getItem('diary_password');
    if (password) {
        showPasswordPrompt();
    } else {
        showDiaryInterface();
    }
    toggleWellnessMenu();
}

function showPasswordPrompt() {
    const overlay = document.createElement('div');
    overlay.id = 'diary-password-overlay';
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 3rem; border-radius: 24px; border: 2px solid rgba(236,72,153,0.3); box-shadow: 0 20px 60px rgba(236,72,153,0.3); max-width: 400px; width: 90%;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                    <h2 style="color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem;">Enter Password</h2>
                    <p style="color: #94a3b8; font-size: 0.9rem;">Your diary is protected</p>
                </div>
                <input type="password" id="diary-password-input" placeholder="Enter password" style="width: 100%; padding: 1rem; background: rgba(15,23,42,0.6); border: 2px solid rgba(236,72,153,0.3); border-radius: 12px; color: #fff; font-size: 1rem; margin-bottom: 1.5rem; outline: none;">
                <div style="display: flex; gap: 1rem;">
                    <button onclick="closeDiaryPassword()" style="flex: 1; padding: 0.875rem; background: rgba(255,255,255,0.1); border: none; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer;">Cancel</button>
                    <button onclick="checkDiaryPassword()" style="flex: 1; padding: 0.875rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer;">Unlock</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('diary-password-input').focus();
}

window.closeDiaryPassword = function() {
    document.getElementById('diary-password-overlay')?.remove();
}

window.checkDiaryPassword = function() {
    const input = document.getElementById('diary-password-input').value;
    const saved = localStorage.getItem('diary_password');
    if (input === saved) {
        closeDiaryPassword();
        showDiaryInterface();
    } else {
        alert('Incorrect password');
    }
}

function showDiaryInterface() {
    const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    const hasPassword = localStorage.getItem('diary_password');
    
    const overlay = document.createElement('div');
    overlay.id = 'diary-overlay';
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 24px; border: 2px solid rgba(236,72,153,0.3); box-shadow: 0 20px 60px rgba(236,72,153,0.3); width: 100%; max-width: 1100px; height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 2rem; border-bottom: 2px solid rgba(236,72,153,0.2); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-size: 2.5rem;">📖</span>
                        <h2 style="background: linear-gradient(135deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2rem; margin: 0;">My Health Diary</h2>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <button onclick="toggleDiaryPassword()" style="padding: 0.625rem 1.25rem; background: rgba(236,72,153,0.2); border: 1px solid rgba(236,72,153,0.4); border-radius: 8px; color: #ec4899; font-weight: 600; cursor: pointer; font-size: 0.85rem;">🔒 ${hasPassword ? 'Change' : 'Set'} Password</button>
                        <button onclick="closeDiary()" style="background: none; border: none; color: #ec4899; font-size: 2rem; cursor: pointer; line-height: 1;">&times;</button>
                    </div>
                </div>
                <div style="flex: 1; display: flex; overflow: hidden;">
                    <div style="width: 250px; border-right: 2px solid rgba(236,72,153,0.2); padding: 1.5rem; overflow-y: auto;">
                        <button onclick="createNewEntry()" style="width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(236,72,153,0.3);">✨ New Entry</button>
                        <div id="diary-list">
                            ${entries.length > 0 ? entries.map((e, i) => `
                                <div onclick="loadDiaryEntry(${i})" style="padding: 1rem; margin: 0.5rem 0; background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1)); border-radius: 10px; cursor: pointer; border-left: 4px solid #ec4899; transition: all 0.3s;" onmouseover="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))'; this.style.transform='translateX(0)'">
                                    <div style="font-size: 0.875rem; color: #ec4899; font-weight: 700; margin-bottom: 0.25rem;">${e.topic}</div>
                                    <div style="font-size: 0.7rem; color: #6b7280;">${new Date(e.timestamp).toLocaleDateString()}</div>
                                </div>
                            `).join('') : '<p style="color: #6b7280; font-size: 0.85rem; text-align: center; padding: 2rem 0.5rem; line-height: 1.5;">No entries yet.<br>Start writing! ✍️</p>'}
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; padding: 2rem;">
                        <input type="text" id="diary-topic" placeholder="✨ What's on your mind today?" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1)); border: 2px solid rgba(236,72,153,0.3); border-radius: 12px; color: #fff; font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; outline: none;">
                        <div style="flex: 1; position: relative; background: linear-gradient(to bottom, #fef3c7, #fde68a); border-radius: 16px; padding: 2.5rem 2rem 2rem 3rem; overflow: hidden; box-shadow: inset 0 4px 20px rgba(0,0,0,0.15); border: 3px solid #d97706;">
                            <div style="position: absolute; top: 0; left: 60px; right: 0; bottom: 0; background: repeating-linear-gradient(transparent, transparent 30px, rgba(217,119,6,0.15) 30px, rgba(217,119,6,0.15) 31px); pointer-events: none; z-index: 1;"></div>
                            <div style="position: absolute; top: 0; left: 60px; width: 3px; height: 100%; background: linear-gradient(to bottom, #dc2626, #ef4444); z-index: 2; box-shadow: 0 0 5px rgba(220,38,38,0.5);"></div>
                            <textarea id="diary-content" placeholder="Dear Diary,&#10;&#10;Today I feel..." style="width: 100%; height: 100%; background: transparent; border: none; outline: none; color: #1f2937; font-size: 1.05rem; line-height: 31px; padding-left: 25px; resize: none; position: relative; z-index: 3; font-family: 'Courier New', monospace; font-weight: 500;"></textarea>
                        </div>
                        <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(236,72,153,0.05); border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem;" id="diary-status">
                                <span style="font-size: 1.2rem;">💾</span>
                                <span>Ready to write...</span>
                            </div>
                            <div style="display: flex; gap: 0.75rem;">
                                <button onclick="deleteDiaryEntry()" style="padding: 0.625rem 1.25rem; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 0.9rem;">🗑️ Delete</button>
                                <button onclick="saveDiaryEntry()" style="padding: 0.625rem 1.25rem; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-size: 0.9rem;">💾 Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    startAutoSave();
    document.getElementById('diary-content').focus();
}

window.closeDiary = function() {
    stopAutoSave();
    document.getElementById('diary-overlay')?.remove();
}

window.toggleDiaryPassword = function() {
    const current = localStorage.getItem('diary_password');
    const action = current ? 'Change' : 'Set';
    const password = prompt(`${action} Password:`);
    if (password) {
        localStorage.setItem('diary_password', password);
        alert('Password saved!');
    }
}

window.createNewEntry = function() {
    currentDiaryEntry = null;
    document.getElementById('diary-topic').value = '';
    document.getElementById('diary-content').value = '';
    document.getElementById('diary-status').innerHTML = '<span style="font-size: 1.2rem;">✨</span><span>New entry - Start writing!</span>';
    document.getElementById('diary-content').focus();
}

window.loadDiaryEntry = function(index) {
    const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    currentDiaryEntry = index;
    document.getElementById('diary-topic').value = entries[index].topic;
    document.getElementById('diary-content').value = entries[index].content;
    document.getElementById('diary-status').innerHTML = `<span style="font-size: 1.2rem;">📅</span><span>Last saved: ${new Date(entries[index].timestamp).toLocaleString()}</span>`;
}

window.saveDiaryEntry = function() {
    const topic = document.getElementById('diary-topic').value.trim();
    const content = document.getElementById('diary-content').value.trim();
    
    if (!topic || !content) {
        alert('Please enter both topic and content');
        return;
    }
    
    const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    const entry = { topic, content, timestamp: Date.now() };
    
    if (currentDiaryEntry !== null) {
        entries[currentDiaryEntry] = entry;
    } else {
        entries.unshift(entry);
        currentDiaryEntry = 0;
    }
    
    localStorage.setItem('diary_entries', JSON.stringify(entries));
    document.getElementById('diary-status').innerHTML = `<span style="font-size: 1.2rem;">✅</span><span>Saved at ${new Date().toLocaleTimeString()}</span>`;
    
    const listHtml = entries.map((e, i) => `
        <div onclick="loadDiaryEntry(${i})" style="padding: 1rem; margin: 0.5rem 0; background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1)); border-radius: 10px; cursor: pointer; border-left: 4px solid #ec4899; transition: all 0.3s;" onmouseover="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))'; this.style.transform='translateX(0)'">
            <div style="font-size: 0.875rem; color: #ec4899; font-weight: 700; margin-bottom: 0.25rem;">${e.topic}</div>
            <div style="font-size: 0.7rem; color: #6b7280;">${new Date(e.timestamp).toLocaleDateString()}</div>
        </div>
    `).join('');
    
    document.getElementById('diary-list').innerHTML = listHtml;
}

window.deleteDiaryEntry = function() {
    if (currentDiaryEntry === null) {
        alert('No entry selected');
        return;
    }
    
    if (confirm('Delete this entry? This cannot be undone.')) {
        const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
        entries.splice(currentDiaryEntry, 1);
        localStorage.setItem('diary_entries', JSON.stringify(entries));
        
        currentDiaryEntry = null;
        document.getElementById('diary-topic').value = '';
        document.getElementById('diary-content').value = '';
        document.getElementById('diary-status').innerHTML = '<span style="font-size: 1.2rem;">💾</span><span>Ready to write...</span>';
        
        const listHtml = entries.length > 0 ? entries.map((e, i) => `
            <div onclick="loadDiaryEntry(${i})" style="padding: 1rem; margin: 0.5rem 0; background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1)); border-radius: 10px; cursor: pointer; border-left: 4px solid #ec4899; transition: all 0.3s;" onmouseover="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))'; this.style.transform='translateX(0)'">
                <div style="font-size: 0.875rem; color: #ec4899; font-weight: 700; margin-bottom: 0.25rem;">${e.topic}</div>
                <div style="font-size: 0.7rem; color: #6b7280;">${new Date(e.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('') : '<p style="color: #6b7280; font-size: 0.85rem; text-align: center; padding: 2rem 0.5rem; line-height: 1.5;">No entries yet.<br>Start writing! ✍️</p>';
        
        document.getElementById('diary-list').innerHTML = listHtml;
    }
}

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const topic = document.getElementById('diary-topic')?.value.trim();
        const content = document.getElementById('diary-content')?.value.trim();
        
        if (topic && content) {
            const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
            const entry = { topic, content, timestamp: Date.now() };
            
            if (currentDiaryEntry !== null) {
                entries[currentDiaryEntry] = entry;
            } else {
                entries.unshift(entry);
                currentDiaryEntry = 0;
            }
            
            localStorage.setItem('diary_entries', JSON.stringify(entries));
            const statusEl = document.getElementById('diary-status');
            if (statusEl) statusEl.innerHTML = `<span style="font-size: 1.2rem;">💾</span><span>Auto-saved at ${new Date().toLocaleTimeString()}</span>`;
        }
    }, 5000);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}
