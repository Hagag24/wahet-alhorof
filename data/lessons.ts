import { Lesson } from '@/types'

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'هيا نتعلم يا جدي',
    description: 'تعلم الأصوات والحروف مع مريم ويوسف في مغامرة عائلية ممتعة',
    environment: 'بيت، حديقة، متجر، دراجة',
    characters: ['مريم', 'يوسف', 'جدي', 'أمي', 'أبي'],
    icon: '🏠',
    color: '#7C5CFF',
    order: 1,
    story: 'اسمي مريم وعمري ست سنوات، وأخي يوسف عمره تسع سنوات، كان يوسف دائمًا يساعد أمي وأبي في أشياء عديدة بالبيت، مثل شراء الأكل من المتجر القريب، والاعتناء بأشجار الحديقة. كنت دائمًا أفكر في أن أتعلم أشياء لأساعد بها أمي وأبي في البيت أيضًا. وفي يوم من الأيام رأيت يوسف وهو يركب دراجته بسرعة ومهارة وهو ذاهب إلى المتجر ليشتري طلبات البيت. شعرت بالحزن، فأنا أيضًا أريد أن أساعد أمي وأبي.',
    storyScenes: [
      { id: 'scene-1-1', text: 'اسمي مريم وعمري ست سنوات، وأخي يوسف عمره تسع سنوات.', image: '/images/stories/maryam_youssef.png' },
      { id: 'scene-1-2', text: 'كان يوسف دائمًا يساعد أمي وأبي في أشياء عديدة بالبيت.', image: '/images/stories/youssef_helping.png' },
      { id: 'scene-1-3', text: 'مثل شراء الأكل من المتجر القريب، والاعتناء بأشجار الحديقة.', image: '/images/stories/youssef_bicycle.png' },
      { id: 'scene-1-4', text: 'كنت دائمًا أفكر في أن أتعلم أشياء لأساعد بها أمي وأبي في البيت أيضًا.', image: '🧕' },
      { id: 'scene-1-5', text: 'وفي يوم من الأيام رأيت يوسف وهو يركب دراجته بسرعة ومهارة وهو ذاهب إلى المتجر ليشتري طلبات البيت.', image: '/images/stories/youssef_bicycle.png' },
      { id: 'scene-1-6', text: 'شعرت بالحزن؛ فأنا – أيضًا – أريد أن أساعد أمي وأبي.', image: '😔' },
    ],
    vocabulary: [
      { word: 'مريم', image: '🧕' },
      { word: 'يوسف', image: '👦' },
      { word: 'بيت', image: '🏠' },
      { word: 'متجر', image: '🏪' },
      { word: 'دراجة', image: '🚲' },
      { word: 'حديقة', image: '🌳' },
      { word: 'أمي', image: '🧕' },
      { word: 'أبي', image: '👨' },
      { word: 'كريم', image: '👦' },
    ],
    sections: {
      objectives: [
        { title: 'خريطة الأبطال السحرية: رادار الأذن الخارقة', description: 'نميّز الحروف المختلفة والمتشابهة في الصوت بأسلوب ممتع.' },
        { title: 'خريطة الأبطال السحرية: مصنع الأشكال', description: 'نربط شكل الحرف بصوته الصحيح داخل الكلمات.' },
        { title: 'خريطة الأبطال السحرية: شفرة الأسماء السرية', description: 'نفهم العلاقة بين اسم الحرف وصوته داخل الكلمة.' },
        { title: 'خريطة الأبطال السحرية: صائد الأصوات والكلمات', description: 'نميّز أصوات الحروف في الكلمات المنطوقة وننطقها جيدًا.' },
        { title: 'خريطة الأبطال السحرية: نادي التحدي والمرح', description: 'نشارك في أنشطة وألعاب تفاعلية ونحقق الإنجاز.' },
      ],
      warmup: [
        { 
          title: 'رسالة الجد المفقودة', 
          description: 'استمع للصوت واختر الفقاعة الصحيحة من (جـ، د، ي) لإكمال كلمة جدي دون كشف الإجابة عند الخطأ.',
          interactive: true,
          scenario: {
            character: 'جدي',
            missingWord: 'جدي',
            bubbles: ['جـ', 'د', 'ي'],
            targetSound: 'جـ'
          }
        },
      ],
      explanation: [
        { 
          title: 'كتاب مريم ويوسف المتحرك', 
          description: 'تمييز الحروف المتشابهة والمختلفة، شكل الحرف وصوته.', 
          cinematic: true
        },
        { 
          title: 'سينما الأصوات مع مريم ويوسف', 
          description: 'اسم الحرف وصوته، وتمييز أصوات الحروف في الكلمات المنطوقة.',
          cinematic: true
        },
      ],
    },
    games: [
      {
        id: 'game-1-1',
        type: 'similar-sound-letters',
        title: 'ما الكلمة الصحيحة للصورة؟',
        description: 'استمع للكلمة فقط ثم اختر الرسم الصحيح',
        icon: '🔤',
        questions: [
          { id: 'q1', image: 'دراجة', question: 'ما الكلمة الصحيحة للصورة؟', audioText: 'دراجة', options: ['ضراجة', 'تراجة', 'دراجة', 'طراجة'], correctAnswer: 'دراجة' },
          { id: 'q2', image: 'يوسف', question: 'ما الكلمة الصحيحة للصورة؟', audioText: 'يوسف', options: ['يوصف', 'يوسف', 'يوزف', 'يوذف'], correctAnswer: 'يوسف' },
          { id: 'q3', image: 'متجر', question: 'ما الكلمة الصحيحة للصورة؟', audioText: 'المتجر', options: ['مدجر', 'مضجر', 'مطجر', 'متجر'], correctAnswer: 'متجر' },
        ],
      },
      {
        id: 'game-1-2',
        type: 'catch-different-word',
        title: 'صياد الأصوات المفقودة',
        description: 'استمع جيدًا ثم اصطد الكلمة المختلفة في الصوت الأول',
        icon: '🎣',
        questions: [
          { id: 'q1', question: 'ما الكلمة المختلفة في الصوت الأول؟', options: ['باب', 'حديقة', 'بيت'], correctAnswer: 'حديقة', pronounceQuestionAndOptions: true },
          { id: 'q2', question: 'ما الكلمة المختلفة في الصوت الأول؟', options: ['يوسف', 'يوم', 'بيت'], correctAnswer: 'بيت', pronounceQuestionAndOptions: true },
          { id: 'q3', question: 'ما الكلمة المختلفة في الصوت الأول؟', options: ['مريم', 'متجر', 'يوسف'], correctAnswer: 'يوسف', pronounceQuestionAndOptions: true },
        ],
      },
      {
        id: 'game-1-3',
        type: 'choose-sound',
        title: 'قفزة الحركات الذكية ومظلة يوسف الملونة',
        description: 'حدد حركة الصوت الأول، ثم ساعد يوسف على اختيار صوت يـ الصحيح تحت المظلة',
        icon: '🔊',
        questions: [
          { id: 'q1', word: 'مريم', question: 'ما الصوت الأول في كلمة مريم؟', options: ['مِ', 'مُ', 'مَ', 'مْ'], correctAnswer: 'مَ' },
          { id: 'q2', word: 'بيت', question: 'ما الصوت الأول في كلمة بيت؟', options: ['بَ', 'بِ', 'بُ', 'بْ'], correctAnswer: 'بَ' },
          { id: 'q3', word: 'يوسف', question: 'استمع إلى كلمة يوسف، أي قطرة تحمل الصوت الصحيح؟', options: ['يَـ', 'يِـ', 'يُـ', 'يْـ'], correctAnswer: 'يُـ' },
        ],
      },
      {
        id: 'game-1-4',
        type: 'letter-forms',
        title: 'قطار الحروف والمحطات وصيد النجوم',
        description: 'حدد موقع حرف م في القطار، ثم اجمع النجمة التي يظهر فيها م في آخر الكلمة',
        icon: '✏️',
        questions: [
          { id: 'q1', word: 'م', question: 'أين يوجد حرف م في أول الكلمة؟', options: ['متجر', 'أمي', 'كريم', 'بيت'], correctAnswer: 'متجر' },
          { id: 'q2', word: 'م', question: 'أين يوجد حرف م في وسط الكلمة؟', options: ['أمي', 'متجر', 'كريم', 'بيت'], correctAnswer: 'أمي' },
          { id: 'q3', word: 'م', question: 'أين يوجد حرف م في آخر الكلمة؟', options: ['كريم', 'متجر', 'أمي', 'بيت'], correctAnswer: 'كريم' },
          { id: 'q4', word: 'م', question: 'صيد النجوم: اجمع النجمة التي يظهر فيها حرف م في آخر الكلمة', options: ['أمي', 'مريم', 'متجر', 'بيت'], correctAnswer: 'مريم' },
        ],
      },
      {
        id: 'game-1-5',
        type: 'letter-position',
        title: 'بستان الحروف',
        description: 'اسحب كل كلمة إلى شجرة الموقع المناسب',
        icon: '📍',
        questions: [
          { id: 'q1', word: 'متجر', question: 'أين يوجد صوت م في كلمة متجر؟', options: ['أول الكلمة', 'وسط الكلمة', 'آخر الكلمة'], correctAnswer: 'أول الكلمة' },
          { id: 'q2', word: 'كريم', question: 'أين يوجد صوت م في كلمة كريم؟', options: ['أول الكلمة', 'وسط الكلمة', 'آخر الكلمة'], correctAnswer: 'آخر الكلمة' },
          { id: 'q3', word: 'أمي', question: 'أين يوجد صوت م في كلمة أمي؟', options: ['أول الكلمة', 'وسط الكلمة', 'آخر الكلمة'], correctAnswer: 'وسط الكلمة' },
        ],
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'أميرة وأسرتها السعيدة',
    description: 'انضم لأميرة في رحلة مع أسرتها المحبة',
    environment: 'بيت وأسرة وحديقة',
    characters: ['أميرة', 'أبي', 'أمي', 'أسرة'],
    icon: '👨‍👩‍👧',
    color: '#39BDF8',
    order: 2,
    story: 'أميرة فتاة صغيرة تعيش مع أسرتها السعيدة. في كل صباح، تستيقظ أميرة وتساعد أمها في ترتيب البيت. أبوها يحب أن يلعب معها في الحديقة. تحب أميرة أسرتها كثيرًا، وتشعر بالسعادة عندما يجتمعون معًا. في يوم الإجازة، ذهبت الأسرة إلى الحديقة الكبيرة. لعبت أميرة وضحكت كثيرًا. قالت: أنا أحب أسرتي!',
    storyScenes: [
      { id: 'scene-2-1', text: 'أميرة فتاة صغيرة تعيش مع أسرتها السعيدة.', image: '🧕' },
      { id: 'scene-2-2', text: 'في كل صباح، تستيقظ أميرة وتساعد أمها في ترتيب البيت.', image: '🧹' },
      { id: 'scene-2-3', text: 'أبوها يحب أن يلعب معها في الحديقة.', image: '👨' },
      { id: 'scene-2-4', text: 'تحب أميرة أسرتها كثيرًا، وتشعر بالسعادة عندما يجتمعون معًا.', image: '👨‍👩‍👧' },
      { id: 'scene-2-5', text: 'في يوم الإجازة، ذهبت الأسرة إلى الحديقة الكبيرة.', image: '🏞️' },
      { id: 'scene-2-6', text: 'لعبت أميرة وضحكت كثيرًا. قالت: أنا أحب أسرتي!', image: '💖' },
    ],
    vocabulary: [
      { word: 'أميرة', image: '🧕' },
      { word: 'أسرة', image: '👨‍👩‍👧' },
      { word: 'بيت', image: '🏠' },
      { word: 'أمي', image: '🧕' },
      { word: 'أبي', image: '👨' },
      { word: 'حديقة', image: '🌳' },
    ],
    sections: {
      objectives: [
        { title: 'صيد الحركة', description: 'نحدد الحركة القصيرة الصحيحة في أول الكلمة (الفتحة، الضمة، الكسرة).' },
        { title: 'القلم السحري', description: 'نكمل الكلمة بالحرف الناقص من خلال مشهد بصري ممتع.' },
      ],
      warmup: [
        { title: 'صندوق المفاجآت', description: 'نسحب أفراد أسرة أميرة الصحيحين إلى بيت الأسرة، والخطأ يعود دون كشف الإجابة.' },
      ],
      explanation: [
        { title: 'رحلة أميرة السعيدة', description: 'شرح غير تفاعلي للحركات القصيرة وإكمال الكلمة بالحرف الناقص.' },
      ],
    },
    games: [
      {
        id: 'game-2-1',
        type: 'choose-sound',
        title: 'سلة الحركات مع أميرة',
        description: 'ضع كل كلمة في سلة الحركة المناسبة للصوت الأول',
        icon: '🔊',
        questions: [
          { id: 'q1', word: 'أميرة', question: 'ما الصوت الأول في كلمة أميرة؟', options: ['أَ', 'أِ', 'أُ', 'إ'], correctAnswer: 'أَ' },
          { id: 'q2', word: 'أسرة', question: 'ما الصوت الأول في كلمة أسرة؟', options: ['أَ', 'أِ', 'أُ', 'إ'], correctAnswer: 'أُ' },
          { id: 'q3', word: 'حديقة', question: 'ما الصوت الأول في كلمة حديقة؟', options: ['حَ', 'حِ', 'حُ', 'خَ'], correctAnswer: 'حَ' },
        ],
      },
      {
        id: 'game-2-2',
        type: 'syllable-clap',
        title: 'محقق المقاطع السحرية',
        description: 'عدّ المقاطع الصوتية ثم اختر العدد الصحيح',
        icon: '👏',
        questions: [
          { id: 'q1', word: 'أميرة', question: 'كم مقطعًا في كلمة أميرة؟', options: ['2', '3', '4'], correctAnswer: '4', syllables: ['أَ', 'مِي', 'رَ', 'ة'] },
          { id: 'q2', word: 'أسرة', question: 'كم مقطعًا في كلمة أسرة؟', options: ['2', '3', '4'], correctAnswer: '3', syllables: ['أُسْ', 'رَ', 'ة'] },
          { id: 'q3', word: 'أبي', question: 'كم مقطعًا في كلمة أبي؟', options: ['2', '3', '4'], correctAnswer: '2', syllables: ['أَ', 'بِي'] },
        ],
      },
      {
        id: 'game-2-3',
        type: 'build-word',
        title: 'مكعبات أميرة السحرية',
        description: 'رتّب المقاطع لتكوين الكلمة المطلوبة',
        icon: '🧩',
        questions: [
          { id: 'q1', question: 'ركّب الكلمة من المقاطع', parts: ['أَ', 'مِي', 'رَة'], options: ['أميرة', 'أمير', 'ميرة', 'أمي'], correctAnswer: 'أميرة' },
          { id: 'q2', question: 'ركّب الكلمة من المقاطع', parts: ['أُسْ', 'رَ', 'ة'], options: ['أسرة', 'أسر', 'سرة', 'أمي'], correctAnswer: 'أسرة' },
          { id: 'q3', question: 'ركّب الكلمة من المقاطع', parts: ['حَ', 'دِي', 'قَة'], options: ['حديقة', 'حديق', 'دقيقة', 'حدي'], correctAnswer: 'حديقة' },
        ],
      },
      {
        id: 'game-2-4',
        type: 'similar-words',
        title: 'محطة الأصوات المتشابهة',
        description: 'اختر الكلمة التي تبدأ بنفس الصوت',
        icon: '🔗',
        questions: [
          { id: 'q1', word: 'أميرة', question: 'أي كلمة تشبه أميرة في البداية؟', options: ['أسرة', 'بيت', 'حديقة', 'يوسف'], correctAnswer: 'أسرة' },
          { id: 'q2', word: 'أمي', question: 'أي كلمة تشبه أمي في البداية؟', options: ['أبي', 'مريم', 'جدي', 'يوسف'], correctAnswer: 'أبي' },
        ],
      },
      {
        id: 'game-2-5',
        type: 'letter-position',
        hidden: true,
        title: 'حدد موقع الحرف',
        description: 'اكتشف مكان الحرف في الكلمة',
        icon: '📍',
        questions: [
          { id: 'q1', word: 'أميرة', question: 'أين يوجد صوت ر في كلمة أميرة؟', options: ['أول الكلمة', 'وسط الكلمة', 'آخر الكلمة'], correctAnswer: 'وسط الكلمة' },
          { id: 'q2', word: 'أسرة', question: 'أين يوجد صوت س في كلمة أسرة؟', options: ['أول الكلمة', 'وسط الكلمة', 'آخر الكلمة'], correctAnswer: 'وسط الكلمة' },
        ],
      },
      {
        id: 'game-2-6',
        type: 'complete-word',
        hidden: true,
        title: 'أكمل الكلمة',
        description: 'اختر الحرف الناقص',
        icon: '✍️',
        questions: [
          { id: 'q1', question: 'أكمل الكلمة: _ميرة', options: ['أ', 'ب', 'ت', 'م'], correctAnswer: 'أ' },
          { id: 'q2', question: 'أكمل الكلمة: _سرة', options: ['أ', 'ب', 'ت', 'م'], correctAnswer: 'أ' },
          { id: 'q3', question: 'أكمل الكلمة: حدي_ة', options: ['ق', 'ك', 'ج', 'خ'], correctAnswer: 'ق' },
        ],
      },
      {
        id: 'game-2-7',
        type: 'harakat',
        hidden: true,
        title: 'اختر الحركة',
        description: 'حدد الحركة الصحيحة للحرف',
        icon: '🎯',
        questions: [
          { id: 'q1', word: 'بيت', question: 'ما حركة الحرف الأول في كلمة بيت؟', options: ['بَيت', 'بِيت', 'بُيت'], correctAnswer: 'بَيت' },
          { id: 'q2', word: 'أمي', question: 'ما حركة الحرف الأول في كلمة أمي؟', options: ['أَمي', 'أِمي', 'أُمي'], correctAnswer: 'أُمي' },
        ],
      },
      {
        id: 'game-2-8',
        type: 'match-picture-word',
        title: 'صائد الكلمات الصحيحة',
        description: 'صل كل صورة بالكلمة المناسبة',
        icon: '🖼️',
        questions: [
          { id: 'q1', image: 'بيت', question: 'ما الكلمة المناسبة للصورة؟', options: ['بيت', 'أسرة', 'حديقة', 'أمي'], correctAnswer: 'بيت' },
          { id: 'q2', image: 'حديقة', question: 'ما الكلمة المناسبة للصورة؟', options: ['بيت', 'أسرة', 'حديقة', 'أمي'], correctAnswer: 'حديقة' },
        ],
      },
      {
        id: 'game-2-9',
        type: 'similar-sound-letters',
        title: 'محطة قطار الأصوات',
        description: 'ميّز بين الحروف المتشابهة في الصوت',
        icon: '🔤',
        questions: [
          { id: 'q1', image: 'أسرة', question: 'اختر الحرف الصحيح في كلمة أسرة', options: ['س', 'ص', 'ث'], correctAnswer: 'س' },
          { id: 'q2', image: 'بيت', question: 'اختر الحرف الصحيح في كلمة بيت', options: ['ت', 'ط', 'ث'], correctAnswer: 'ت' },
        ],
      },
      {
        id: 'game-2-10',
        type: 'catch-different-word',
        title: 'كاشف الكلمة المختلفة',
        description: 'حدد الكلمة التي تبدأ بصوت مختلف',
        icon: '🎣',
        questions: [
          { id: 'q1', question: 'حدد الكلمة المختلفة في الصوت الأول: أميرة، أسرة، بيت', options: ['أميرة', 'أسرة', 'بيت'], correctAnswer: 'بيت' },
        ],
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'عالم الحيوان',
    description: 'اكتشف عالم الحيوانات الرائع مع سامي',
    environment: 'غابة وحيوانات',
    characters: ['سامي', 'الأب'],
    icon: '🦁',
    color: '#4ECDC4',
    order: 3,
    story: 'سامي يحب الحيوانات، ويحب جمع صورها. في يوم الإجازة، جهز الأب فيديو عن حيوانات الغابة. جلس سامي مع والده يشاهد الحيوانات وهو مستمتع. شاهد سامي أسدًا يستريح تحت شجرة، فقال الأب: الأسد هو ملك الغابة، وهو حيوان قوي. وسمع البلبل يغني بصوته الجميل، فشعر سامي بالسعادة. ومن خلف الشجرة، خرج الأرنب يجري، فقال سامي: الأرنب سريع جدًا. وشاهد نملة تجر حبة كبيرة، فصاح: انظر يا أبي، النملة قوية جدًا. قال الأب: ماذا تعلمت من هذا الفيديو؟ فقال سامي: تعلمت الكثير عن عالم الحيوان، فهو عالم عجيب.',
    storyScenes: [
      { id: 'scene-3-1', text: 'سامي يحب الحيوانات، ويحب جمع صورها.', image: '👦' },
      { id: 'scene-3-2', text: 'في يوم الإجازة، جهز الأب فيديو عن حيوانات الغابة.', image: '🌲' },
      { id: 'scene-3-3', text: 'شاهد سامي أسدًا يستريح تحت شجرة، فقال الأب: الأسد هو ملك الغابة، وهو حيوان قوي.', image: '/images/stories/lion_forest.png' },
      { id: 'scene-3-4', text: 'وسمع البلبل يغني بصوته الجميل، فشعر سامي بالسعادة.', image: '🐦' },
      { id: 'scene-3-5', text: 'ومن خلف الشجرة، خرج الأرنب يجري، فقال سامي: الأرنب سريع جدًا.', image: '/images/stories/bunny_running.png' },
      { id: 'scene-3-6', text: 'وشاهد نملة تجر حبة كبيرة، فصاح: انظر يا أبي، النملة قوية جدًا.', image: '🐜' },
      { id: 'scene-3-7', text: 'قال سامي: تعلمت الكثير عن عالم الحيوان، فهو عالم عجيب.', image: '🌍' },
    ],
    vocabulary: [
      { word: 'سامي', image: '👦' },
      { word: 'أسد', image: '🦁' },
      { word: 'أرنب', image: '🐰' },
      { word: 'نملة', image: '🐜' },
      { word: 'غابة', image: '🌲' },
      { word: 'شجرة', image: '🌳' },
      { word: 'حيوان', image: '🐾' },
      { word: 'بلبل', image: '🐦' },
    ],
    sections: {
      objectives: [
        { title: 'ألبوم حيوانات سامي السحري', description: 'مشهد تمهيدي يعرّف التحليل والدمج وتحويل الصوت إلى كتابة باستخدام: أرنب، نملة، أسد.' },
      ],
      warmup: [
        { title: 'من خلف الشجرة؟', description: 'استمع للزئير الخفيف واختر: أسد أم أرنب.' },
      ],
      explanation: [
        { title: 'قطار الكلمات في غابة الحيوان', description: 'تحليل الكلمات وعد المقاطع، دمج الأصوات، ثم تحويل الصوت المسموع إلى كتابة.' },
      ],
    },
    games: [
      {
        id: 'game-3-1',
        type: 'syllable-clap',
        title: 'صفق المقاطع',
        description: 'عدّ المقاطع الصوتية في الكلمة',
        icon: '👏',
        questions: [
          { id: 'q1', word: 'سامي', question: 'كم مقطعًا في كلمة سامي؟', options: ['2', '3', '4'], correctAnswer: '2', syllables: ['سا', 'مي'] },
          { id: 'q2', word: 'أرنب', question: 'كم مقطعًا في كلمة أرنب؟', options: ['2', '3', '4'], correctAnswer: '3', syllables: ['أَ', 'رَ', 'نَب'] },
          { id: 'q3', word: 'نملة', question: 'كم مقطعًا في كلمة نملة؟', options: ['2', '3', '4'], correctAnswer: '3', syllables: ['نَ', 'مَ', 'لة'] },
          { id: 'q4', word: 'أسد', question: 'كم مقطعًا في كلمة أسد؟', options: ['2', '3', '4'], correctAnswer: '3', syllables: ['أَ', 'سَ', 'د'] },
        ],
      },
      {
        id: 'game-3-2',
        type: 'build-word',
        title: 'ركّب الكلمة',
        description: 'اجمع المقاطع لتكوين الكلمة',
        icon: '🧩',
        questions: [
          { id: 'q1', question: 'ركّب الكلمة من المقاطع', parts: ['غَا', 'بَة'], options: ['غابة', 'غاب', 'غبة', 'أمي'], correctAnswer: 'غابة' },
          { id: 'q2', question: 'ركّب الكلمة من المقاطع', parts: ['شَ', 'جَ', 'رَة'], options: ['شجرة', 'شجر', 'شجة', 'بيت'], correctAnswer: 'شجرة' },
          { id: 'q3', question: 'ركّب الكلمة من المقاطع', parts: ['حَ', 'يَ', 'وان'], options: ['حيوان', 'حوان', 'حيون', 'أسد'], correctAnswer: 'حيوان' },
        ],
      },
      {
        id: 'game-3-3',
        type: 'match-picture-word',
        title: 'طابق الصورة بالكلمة',
        description: 'صل كل صورة بالكلمة المناسبة',
        icon: '🖼️',
        questions: [
          { id: 'q1', image: 'أسد', question: 'ما الكلمة المناسبة للصورة؟', options: ['أسد', 'أرنب', 'نملة', 'بلبل'], correctAnswer: 'أسد' },
          { id: 'q2', image: 'أرنب', question: 'ما الكلمة المناسبة للصورة؟', options: ['أسد', 'أرنب', 'نملة', 'بلبل'], correctAnswer: 'أرنب' },
          { id: 'q3', image: 'شجرة', question: 'ما الكلمة المناسبة للصورة؟', options: ['غابة', 'شجرة', 'حيوان', 'نملة'], correctAnswer: 'شجرة' },
        ],
      },
      {
        id: 'game-3-4',
        type: 'choose-sound',
        hidden: true,
        title: 'اختر الصوت الصحيح',
        description: 'حدد الصوت الأول في الكلمة',
        icon: '🔊',
        questions: [
          { id: 'q1', word: 'سامي', question: 'ما الصوت الأول في كلمة سامي؟', options: ['سَ', 'سِ', 'سُ', 'ص'], correctAnswer: 'سَ' },
          { id: 'q2', word: 'غابة', question: 'ما الصوت الأول في كلمة غابة؟', options: ['غَ', 'غِ', 'غُ', 'ق'], correctAnswer: 'غَ' },
          { id: 'q3', word: 'نملة', question: 'ما الصوت الأول في كلمة نملة؟', options: ['نَ', 'نِ', 'نُ', 'م'], correctAnswer: 'نَ' },
        ],
      },
    ],
  },
  {
    id: 'lesson-4',
    title: 'يوم في المدرسة',
    description: 'عش يومًا ممتعًا في المدرسة مع كريم وأصدقائه',
    environment: 'مدرسة وفصل وأدوات',
    characters: ['كريم', 'طارق', 'محجبة'],
    icon: '🏫',
    color: '#FFD166',
    order: 4,
    story: 'استيقظ كريم من نومه سعيدًا، لبس ملابسه، وحمل حقيبته. وعندما وصل إلى المدرسة، استقبلته المعلمة بابتسامة. في حصة الرسم أخرج كريم القلم الرصاص وألوانه الجميلة، ورسم زهرة ملونة فيها أحمر وأصفر وأخضر. أراد كريم أن يمسح خطأ ولم يجد الممحاة، فقال لصديقه طارق: أعطني الممحاة من فضلك. فقال له طارق: هذه هي، تفضل. ابتسم كريم وقال: شكرًا. نظر كريم إلى لوحته وهو مسرور، وقال: انظري يا معلمتي، لقد رسمت زهرة جميلة. قالت المعلمة: أحسنت، إنها رسمة جميلة.',
    storyScenes: [
      { id: 'scene-4-1', text: 'استيقظ كريم من نومه سعيدًا، لبس ملابسه، وحمل حقيبته.', image: '🎒' },
      { id: 'scene-4-2', text: 'وعندما وصل إلى المدرسة، استقبلته المعلمة بابتسامة.', image: '🏫' },
      { id: 'scene-4-3', text: 'في حصة الرسم أخرج كريم القلم الرصاص وألوانه الجميلة.', image: '✏️' },
      { id: 'scene-4-4', text: 'ورسم زهرة ملونة فيها أحمر وأصفر وأخضر.', image: '🌸' },
      { id: 'scene-4-5', text: 'أراد كريم أن يمسح خطأ ولم يجد الممحاة، فقال لصديقه طارق: أعطني الممحاة من فضلك.', image: '🧽' },
      { id: 'scene-4-6', text: 'فقال له طارق: هذه هي، تفضل. ابتسم كريم وقال: شكرًا.', image: '✨' },
      { id: 'scene-4-7', text: 'نظر كريم إلى لوحته وهو مسرور، وقال: انظري يا معلمتي، لقد رسمت زهرة جميلة.', image: '🖼️' },
      { id: 'scene-4-8', text: 'قالت المعلمة: أحسنت، إنها رسمة جميلة.', image: '🧕' },
    ],
    vocabulary: [
      { word: 'كريم', image: '👦' },
      { word: 'مدرسة', image: '🏫' },
      { word: 'معلمة', image: '🧕' },
      { word: 'قلم', image: '✏️' },
      { word: 'زهرة', image: '🌸' },
      { word: 'ممحاة', image: '🧽' },
      { word: 'حقيبة', image: '🎒' },
      { word: 'طارق', image: '👦' },
    ],
    sections: {
      objectives: [
        { title: 'فيديو الألوان والكلمات الذكي', description: 'تمييز الأصوات المتشابهة، قراءة الكلمات، ثم إكمال الكلمات والحروف داخل مشهد الفصل.' },
      ],
      warmup: [
        {
          title: 'صندوق الأصوات الضائع',
          description: 'صندوق هدية سحري في المركز، ثلاث مفاتيح: كَ، قَ، خَ. الصندوق يهمس كَ... كَ... كَ... الطالب يختار كَ. الصحيح يفتح الصندوق ويظهر كريم. الخطأ يهز ويعيد المحاولة دون كشف الإجابة.',
          interactive: true,
          scenario: {
            item: 'صندوق هدية سحري',
            keys: ['كَ', 'قَ', 'خَ'],
            whisper: 'كَ... كَ... كَ...',
            correctChoice: 'كَ',
            reward: 'كريم'
          }
        },
      ],
      explanation: [
        { 
          title: 'قطار كلمات كريم السريع', 
          description: 'رادار الأصوات: طارق وليس تارق. صائد الصور: مطابقة ممحاة. الكلمة المفقودة: "حمل ........" correct "حقيبته".',
          cinematic: true
        },
      ],
    },
    games: [
      {
        id: 'game-4-1',
        type: 'similar-words',
        title: 'الكلمات المتشابهة',
        description: 'اختر الكلمة المتشابهة في الصوت',
        icon: '🔗',
        questions: [
          { id: 'q1', word: 'معلمة', question: 'أي كلمة تشبه معلمة في البداية؟', options: ['أبي', 'مهندسة', 'جميلة', 'يوسف'], correctAnswer: 'مهندسة' },
          { id: 'q2', word: 'مدرسة', question: 'أي كلمة تشبه مدرسة في النهاية؟', options: ['معلمة', 'كريم', 'طارق', 'أمي'], correctAnswer: 'معلمة' },
          { id: 'q3', word: 'أمي', question: 'أي كلمة تشبه أمي في البداية؟', options: ['أبي', 'مريم', 'جدي', 'يوسف'], correctAnswer: 'أبي' },
        ],
      },
      {
        id: 'game-4-2',
        type: 'match-picture-word',
        title: 'طابق الصورة بالكلمة',
        description: 'صل كل صورة بالكلمة المناسبة',
        icon: '🖼️',
        questions: [
          { id: 'q1', image: 'معلمة', question: 'ما الكلمة المناسبة للصورة؟', options: ['معلمة', 'قلم', 'زهرة', 'ممحاة'], correctAnswer: 'معلمة' },
          { id: 'q2', image: 'قلم', question: 'ما الكلمة المناسبة للصورة؟', options: ['معلمة', 'قلم', 'زهرة', 'ممحاة'], correctAnswer: 'قلم' },
          { id: 'q3', image: 'زهرة', question: 'ما الكلمة المناسبة للصورة؟', options: ['معلمة', 'قلم', 'زهرة', 'ممحاة'], correctAnswer: 'زهرة' },
          { id: 'q4', image: 'ممحاة', question: 'ما الكلمة المناسبة للصورة؟', options: ['معلمة', 'قلم', 'زهرة', 'ممحاة'], correctAnswer: 'ممحاة' },
        ],
      },
      {
        id: 'game-4-3',
        type: 'complete-sentence',
        title: 'أكمل الجملة',
        description: 'اختر الكلمة المناسبة لإكمال الجملة',
        icon: '📝',
        questions: [
          { id: 'q1', sentence: 'ذهب كريم إلى ........', question: 'أكمل الجملة', options: ['المدرسة', 'المتجر', 'الحديقة'], correctAnswer: 'المدرسة', image: 'مدرسة' },
          { id: 'q2', sentence: 'رسم كريم ........ جميلة', question: 'أكمل الجملة', options: ['لوحة', 'زهرة', 'رسمة'], correctAnswer: 'زهرة', image: 'زهرة' },
          { id: 'q3', sentence: 'أعطني ........ من فضلك', question: 'أكمل الجملة', options: ['قلم', 'زهرة', 'ممحاة'], correctAnswer: 'ممحاة', image: 'ممحاة' },
        ],
      },
      {
        id: 'game-4-4',
        type: 'choose-sound',
        hidden: true,
        title: 'اختر الصوت الصحيح',
        description: 'حدد الصوت الأول في الكلمة',
        icon: '🔊',
        questions: [
          { id: 'q1', word: 'كريم', question: 'ما الصوت الأول في كلمة كريم؟', options: ['كَ', 'كِ', 'كُ', 'قَ'], correctAnswer: 'كَ' },
          { id: 'q2', word: 'مدرسة', question: 'ما الصوت الأول في كلمة مدرسة؟', options: ['مَ', 'مِ', 'مُ', 'نَ'], correctAnswer: 'مَ' },
          { id: 'q3', word: 'زهرة', question: 'ما الصوت الأول في كلمة زهرة؟', options: ['زَ', 'زِ', 'زُ', 'سَ'], correctAnswer: 'زَ' },
        ],
      },
    ],
  },
]

export const getLessonById = (id: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id)
}

export const getNextLesson = (currentLessonId: string): Lesson | undefined => {
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId)
  if (currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1]
  }
  return undefined
}
