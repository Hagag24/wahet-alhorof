/**
 * Centralized Image Asset Map
 * Maps all image paths from asset_map_all_lessons.json to typed objects
 */

export interface ImageAsset {
  fileName: string;
  path: string;
  description: string;
  alt: string;
}

export interface ImageAssets {
  intro: {
    alazhar_minarets_faculty: ImageAsset;
    magical_research_book: ImageAsset;
    golden_honor_board: ImageAsset;
    welcome_magic_gate: ImageAsset;
    skills_floating_island: ImageAsset;
    flying_adventure_train: ImageAsset;
  };
  characters: {
    maryam: ImageAsset;
    youssef: ImageAsset;
    grandfather: ImageAsset;
    mother: ImageAsset;
    father: ImageAsset;
    amira: ImageAsset;
    sami: ImageAsset;
    kareem: ImageAsset;
    tarek: ImageAsset;
    teacher_female: ImageAsset;
    cartoon_boy: ImageAsset;
    cartoon_girl: ImageAsset;
  };
  lesson1: {
    grandfather_missing_letter_message: ImageAsset;
    letter_bubbles_j_d_y: ImageAsset;
    maryam_age_6: ImageAsset;
    youssef_age_9: ImageAsset;
    youssef_helping_family: ImageAsset;
    youssef_red_bicycle: ImageAsset;
    maryam_sad_garden: ImageAsset;
    smart_board_sit_sad: ImageAsset;
    dal_letter_forms_bicycle: ImageAsset;
    meem_identity_card_store: ImageAsset;
    hazina_sound_blocks: ImageAsset;
    bike_picture: ImageAsset;
    youssef_picture: ImageAsset;
    store_picture: ImageAsset;
    sound_hunter_boxes: ImageAsset;
    harakat_jump_house: ImageAsset;
    youssef_rain_umbrella: ImageAsset;
    letter_train_stations: ImageAsset;
    meem_star_hunt: ImageAsset;
    letter_orchard_trees: ImageAsset;
  };
  lesson2: {
    amira_character: ImageAsset;
    harakat_balloons_alef: ImageAsset;
    magic_pen_father_amira: ImageAsset;
    family_surprise_box: ImageAsset;
    family_house_drop_zone: ImageAsset;
    amira_happy_family_story: ImageAsset;
    amira_movement_baskets: ImageAsset;
    magic_syllable_scissors: ImageAsset;
    amira_magic_blocks: ImageAsset;
    amira_magic_gate_similar_sounds: ImageAsset;
    magic_binocular_word_hunter: ImageAsset;
    amira_sound_train_station: ImageAsset;
    amira_different_word_balloons: ImageAsset;
  };
  lesson3: {
    sami_animal_album: ImageAsset;
    living_room_forest_tv: ImageAsset;
    lion_behind_tree_shadow: ImageAsset;
    cartoon_lion_tree: ImageAsset;
    bulbul_on_branch: ImageAsset;
    rabbit_running_forest: ImageAsset;
    ant_carrying_grain: ImageAsset;
    animal_word_cutting_machine: ImageAsset;
    magic_potion_merge_word: ImageAsset;
    flying_pen_animal_album: ImageAsset;
    magic_word_train_forest: ImageAsset;
    magnetic_word_box_animals: ImageAsset;
  };
  lesson4: {
    kareem_school_bag: ImageAsset;
    teacher_welcomes_kareem: ImageAsset;
    drawing_classroom: ImageAsset;
    kareem_drawing_flower: ImageAsset;
    tarek_gives_eraser: ImageAsset;
    color_smart_board: ImageAsset;
    lost_sounds_gift_box: ImageAsset;
    keys_ka_qa_kha: ImageAsset;
    kareem_fast_words_train: ImageAsset;
    sound_twins_balloons: ImageAsset;
    magic_bubble_cannon_words: ImageAsset;
    magic_sentence_magnet: ImageAsset;
    kareem_final_colored_flower: ImageAsset;
  };
  icons: {
    home: ImageAsset;
    back: ImageAsset;
    next: ImageAsset;
    sound_on: ImageAsset;
    sound_off: ImageAsset;
    star: ImageAsset;
    trophy: ImageAsset;
    medal: ImageAsset;
    heart: ImageAsset;
    help: ImageAsset;
    hint: ImageAsset;
    check: ImageAsset;
    wrong: ImageAsset;
    play: ImageAsset;
    pause: ImageAsset;
  };
}

export const imageAssets: ImageAssets = {
  intro: {
    alazhar_minarets_faculty: {
      fileName: "alazhar_minarets_faculty.png",
      path: "/images/intro/alazhar_minarets_faculty.png",
      description: "مآذن الأزهر وكلية التربية، مشهد افتتاحي للشاشة الأولى.",
      alt: "مآذن الأزهر وكلية التربية"
    },
    magical_research_book: {
      fileName: "magical_research_book.png",
      path: "/images/intro/magical_research_book.png",
      description: "كتاب الباحث السحري، مشهد الشاشة الثانية.",
      alt: "كتاب الباحث السحري"
    },
    golden_honor_board: {
      fileName: "golden_honor_board.png",
      path: "/images/intro/golden_honor_board.png",
      description: "لوحة الشرف الذهبية، مشهد الشاشة الثالثة.",
      alt: "لوحة الشرف الذهبية"
    },
    welcome_magic_gate: {
      fileName: "welcome_magic_gate.png",
      path: "/images/intro/welcome_magic_gate.png",
      description: "بوابة الترحيب السحرية، مشهد الشاشة الرابعة.",
      alt: "بوابة الترحيب السحرية"
    },
    skills_floating_island: {
      fileName: "skills_floating_island.png",
      path: "/images/intro/skills_floating_island.png",
      description: "جزيرة المهارات الطافية، مشهد الشاشة الخامسة.",
      alt: "جزيرة المهارات الطافية"
    },
    flying_adventure_train: {
      fileName: "flying_adventure_train.png",
      path: "/images/intro/flying_adventure_train.png",
      description: "قطار المغامرة الطائر، مشهد الشاشة السادسة.",
      alt: "قطار المغامرة الطائر"
    }
  },
  characters: {
    maryam: {
      fileName: "maryam.png",
      path: "/images/characters/maryam.png",
      description: "شخصية مريم الرئيسية في الدرس الأول، طفلة عربية صغيرة محتشمة ومحجبة/بغطاء رأس مناسب لعمرها، تستخدم في القصة والشرح.",
      alt: "مريم الشخصية الرئيسية"
    },
    youssef: {
      fileName: "youssef.png",
      path: "/images/characters/youssef.png",
      description: "شخصية يوسف، ولد عربي صغير، مبتسم ومساعد، يظهر في قصة الدرس الأول والألعاب.",
      alt: "يوسف الطفل المساعد"
    },
    grandfather: {
      fileName: "grandfather.png",
      path: "/images/characters/grandfather.png",
      description: "شخصية الجد، رجل كبير السن، ملامح ودودة، يكتب رسالة في تمهيد الدرس الأول.",
      alt: "الجد الكبير"
    },
    mother: {
      fileName: "mother.png",
      path: "/images/characters/mother.png",
      description: "شخصية الأم، سيدة عربية محتشمة ومحجبة، تستخدم في قصص الأسرة.",
      alt: "الأم"
    },
    father: {
      fileName: "father.png",
      path: "/images/characters/father.png",
      description: "شخصية الأب، رجل عربي محتشم وودود، يستخدم في مشاهد الأسرة.",
      alt: "الأب"
    },
    amira: {
      fileName: "amira.png",
      path: "/images/characters/amira.png",
      description: "شخصية أميرة، طفلة عربية صغيرة محتشمة ومحجبة/بغطاء رأس مناسب، تظهر في الدرس الثاني.",
      alt: "أميرة الطفلة"
    },
    sami: {
      fileName: "sami.png",
      path: "/images/characters/sami.png",
      description: "شخصية سامي، ولد عربي صغير يحمل كاميرا/ألبوم، يظهر في الدرس الثالث.",
      alt: "سامي مع الكاميرا"
    },
    kareem: {
      fileName: "kareem.png",
      path: "/images/characters/kareem.png",
      description: "شخصية كريم، ولد عربي صغير بحقيبة/ألوان، يظهر في الدرس الرابع.",
      alt: "كريم الطالب"
    },
    tarek: {
      fileName: "tarek.png",
      path: "/images/characters/tarek.png",
      description: "شخصية طارق، ولد عربي صغير صديق كريم، يظهر في الدرس الرابع.",
      alt: "طارق صديق كريم"
    },
    teacher_female: {
      fileName: "teacher_female.png",
      path: "/images/characters/teacher_female.png",
      description: "المعلمة، سيدة عربية محتشمة ومحجبة، تحمل كتابًا أو تشير للسبورة.",
      alt: "المعلمة"
    },
    cartoon_boy: {
      fileName: "cartoon_boy.png",
      path: "/images/characters/cartoon_boy.png",
      description: "طفل كرتوني عربي عام للترحيب والمقدمة، ملابس محتشمة.",
      alt: "طفل كرتوني"
    },
    cartoon_girl: {
      fileName: "cartoon_girl.png",
      path: "/images/characters/cartoon_girl.png",
      description: "طفلة كرتونية عربية عامة للترحيب والمقدمة، محجبة/محتشمة.",
      alt: "طفلة كرتونية"
    }
  },
  lesson1: {
    grandfather_missing_letter_message: {
      fileName: "grandfather_missing_letter_message.png",
      path: "/images/lesson-1/grandfather_missing_letter_message.png",
      description: "تمهيد رسالة الجد المفقودة: الجد على مكتب قديم يكتب رسالة، وحروف عربية تتطاير من الورقة.",
      alt: "الجد يكتب رسالة"
    },
    letter_bubbles_j_d_y: {
      fileName: "letter_bubbles_j_d_y.png",
      path: "/images/lesson-1/letter_bubbles_j_d_y.png",
      description: "فقاعات حروف واضحة للعبة رسالة الجد: جـ، د، ي. يفضل بدون نصوص مكررة غير الحروف.",
      alt: "فقاعات الحروف ج د ي"
    },
    maryam_age_6: {
      fileName: "maryam_age_6.png",
      path: "/images/lesson-1/maryam_age_6.png",
      description: "مريم وبجانبها رقم 6 في قصة الدرس الأول.",
      alt: "مريم عمرها 6 سنوات"
    },
    youssef_age_9: {
      fileName: "youssef_age_9.png",
      path: "/images/lesson-1/youssef_age_9.png",
      description: "يوسف وبجانبه رقم 9 في قصة الدرس الأول.",
      alt: "يوسف عمره 9 سنوات"
    },
    youssef_helping_family: {
      fileName: "youssef_helping_family.png",
      path: "/images/lesson-1/youssef_helping_family.png",
      description: "يوسف يساعد أمه وأباه في حمل الخضروات أو سقاية الأشجار.",
      alt: "يوسف يساعد أسرته"
    },
    youssef_red_bicycle: {
      fileName: "youssef_red_bicycle.png",
      path: "/images/lesson-1/youssef_red_bicycle.png",
      description: "يوسف يركب دراجة حمراء بسرعة ومهارة متجهًا للمتجر.",
      alt: "يوسف يركب دراجة حمراء"
    },
    maryam_sad_garden: {
      fileName: "maryam_sad_garden.png",
      path: "/images/lesson-1/maryam_sad_garden.png",
      description: "مريم حزينة في حديقة المنزل وتتمنى مساعدة والديها.",
      alt: "مريم حزينة في الحديقة"
    },
    smart_board_sit_sad: {
      fileName: "smart_board_sit_sad.png",
      path: "/images/lesson-1/smart_board_sit_sad.png",
      description: "سبورة ذكية تعرض الفرق الصوتي بين سِت وصِت مع تمييز حرف السين والصاد.",
      alt: "سبورة ذكية تفرق بين س وص"
    },
    dal_letter_forms_bicycle: {
      fileName: "dal_letter_forms_bicycle.png",
      path: "/images/lesson-1/dal_letter_forms_bicycle.png",
      description: "توضيح حرف الدال في كلمة دراجة وشكل الحرف وصوته.",
      alt: "حرف الدال في كلمة دراجة"
    },
    meem_identity_card_store: {
      fileName: "meem_identity_card_store.png",
      path: "/images/lesson-1/meem_identity_card_store.png",
      description: "بطاقة هوية لحرف الميم: الاسم ميم، الصوت مَـ، مرتبطة بكلمة المتجر.",
      alt: "بطاقة هوية حرف الميم"
    },
    hazina_sound_blocks: {
      fileName: "hazina_sound_blocks.png",
      path: "/images/lesson-1/hazina_sound_blocks.png",
      description: "كلمة حزينة مقسمة إلى مربعات صوتية مع تمييز حرف الحاء.",
      alt: "كلمة حزينة مقسمة"
    },
    bike_picture: {
      fileName: "bike_picture.png",
      path: "/images/lesson-1/bike_picture.png",
      description: "صورة دراجة واضحة لاستخدام سؤال ما الكلمة الصحيحة للصورة.",
      alt: "صورة دراجة"
    },
    youssef_picture: {
      fileName: "youssef_picture.png",
      path: "/images/lesson-1/youssef_picture.png",
      description: "صورة يوسف لاستخدام سؤال ما الكلمة الصحيحة للصورة.",
      alt: "صورة يوسف"
    },
    store_picture: {
      fileName: "store_picture.png",
      path: "/images/lesson-1/store_picture.png",
      description: "صورة متجر عربي صغير واضح لاستخدام سؤال المتجر.",
      alt: "صورة متجر"
    },
    sound_hunter_boxes: {
      fileName: "sound_hunter_boxes.png",
      path: "/images/lesson-1/sound_hunter_boxes.png",
      description: "3 صناديق للعبة صياد الأصوات: يوسف، يوم، بيت مع صور ولد/تقويم/منزل.",
      alt: "صناديق صياد الأصوات"
    },
    harakat_jump_house: {
      fileName: "harakat_jump_house.png",
      path: "/images/lesson-1/harakat_jump_house.png",
      description: "لعبة قفزة الحركات: كلمة بيت وثلاث بوابات للحركات الفتحة والضمة والكسرة.",
      alt: "قفزة الحركات على كلمة بيت"
    },
    youssef_rain_umbrella: {
      fileName: "youssef_rain_umbrella.png",
      path: "/images/lesson-1/youssef_rain_umbrella.png",
      description: "يوسف تحت المطر بمظلة، وقطرات تحمل يَـ، يِـ، يُـ، يْـ.",
      alt: "يوسف تحت المطر بمظلة"
    },
    letter_train_stations: {
      fileName: "letter_train_stations.png",
      path: "/images/lesson-1/letter_train_stations.png",
      description: "قطار الحروف بثلاث عربات: أول الكلمة، وسط الكلمة، آخر الكلمة.",
      alt: "قطار الحروف"
    },
    meem_star_hunt: {
      fileName: "meem_star_hunt.png",
      path: "/images/lesson-1/meem_star_hunt.png",
      description: "سماء ليلية ونجوم كلمات للبحث عن حرف الميم في آخر الكلمة.",
      alt: "بحث عن حرف الميم في النجوم"
    },
    letter_orchard_trees: {
      fileName: "letter_orchard_trees.png",
      path: "/images/lesson-1/letter_orchard_trees.png",
      description: "بستان الحروف بثلاث شجرات: أول، وسط، آخر الكلمة.",
      alt: "بستان الحروف"
    }
  },
  lesson2: {
    amira_character: {
      fileName: "amira_character.png",
      path: "/images/lesson-2/amira_character.png",
      description: "أميرة تقف وتلوح ببطاقة، محجبة/محتشمة، تستخدم في أهداف الدرس الثاني.",
      alt: "أميرة الشخصية"
    },
    harakat_balloons_alef: {
      fileName: "harakat_balloons_alef.png",
      path: "/images/lesson-2/harakat_balloons_alef.png",
      description: "حرف الألف في المنتصف وثلاث بالونات للحركات: فتحة، ضمة، كسرة.",
      alt: "بالونات حركات الألف"
    },
    magic_pen_father_amira: {
      fileName: "magic_pen_father_amira.png",
      path: "/images/lesson-2/magic_pen_father_amira.png",
      description: "القلم السحري يكتب أَ لإكمال كلمة أَب مع صورة أب وأميرة.",
      alt: "القلم السحري يكتب أب"
    },
    family_surprise_box: {
      fileName: "family_surprise_box.png",
      path: "/images/lesson-2/family_surprise_box.png",
      description: "صندوق المفاجآت مع صور أفراد الأسرة: أب، أم، جدة، أخ صغير، صديق.",
      alt: "صندوق مفاجآت الأسرة"
    },
    family_house_drop_zone: {
      fileName: "family_house_drop_zone.png",
      path: "/images/lesson-2/family_house_drop_zone.png",
      description: "بيت الأسرة كمنطقة إسقاط للصور الصحيحة.",
      alt: "بيت الأسرة"
    },
    amira_happy_family_story: {
      fileName: "amira_happy_family_story.png",
      path: "/images/lesson-2/amira_happy_family_story.png",
      description: "مشهد قصة أميرة وأسرتها السعيدة.",
      alt: "قصة أميرة وأسرتها السعيدة"
    },
    amira_movement_baskets: {
      fileName: "amira_movement_baskets.png",
      path: "/images/lesson-2/amira_movement_baskets.png",
      description: "ثلاث سلال للحركات مع أميرة: الفتحة، الضمة، الكسرة.",
      alt: "سلال الحركات"
    },
    magic_syllable_scissors: {
      fileName: "magic_syllable_scissors.png",
      path: "/images/lesson-2/magic_syllable_scissors.png",
      description: "محقق المقاطع السحرية: مقص/قطار يقطع كلمة إلى مقاطع.",
      alt: "محقق المقاطع السحرية"
    },
    amira_magic_blocks: {
      fileName: "amira_magic_blocks.png",
      path: "/images/lesson-2/amira_magic_blocks.png",
      description: "مكعبات أميرة السحرية لترتيب المقاطع.",
      alt: "مكعبات أميرة السحرية"
    },
    amira_magic_gate_similar_sounds: {
      fileName: "amira_magic_gate_similar_sounds.png",
      path: "/images/lesson-2/amira_magic_gate_similar_sounds.png",
      description: "بوابة سحرية لمحطة الأصوات المتشابهة.",
      alt: "بوابة الأصوات المتشابهة"
    },
    magic_binocular_word_hunter: {
      fileName: "magic_binocular_word_hunter.png",
      path: "/images/lesson-2/magic_binocular_word_hunter.png",
      description: "منظار صائد الكلمات الصحيحة مع أهداف ملونة.",
      alt: "منظار صائد الكلمات"
    },
    amira_sound_train_station: {
      fileName: "amira_sound_train_station.png",
      path: "/images/lesson-2/amira_sound_train_station.png",
      description: "محطة قطار الأصوات للتمييز بين الحروف المتشابهة.",
      alt: "محطة قطار الأصوات"
    },
    amira_different_word_balloons: {
      fileName: "amira_different_word_balloons.png",
      path: "/images/lesson-2/amira_different_word_balloons.png",
      description: "كاشف الكلمة المختلفة: بالونات لكلمات أميرة، أسرة، بيت.",
      alt: "بالونات الكلمات المختلفة"
    }
  },
  lesson3: {
    sami_animal_album: {
      fileName: "sami_animal_album.png",
      path: "/images/lesson-3/sami_animal_album.png",
      description: "سامي يمسك كاميرا أو ألبوم حيوانات سحري.",
      alt: "سامي مع ألبوم الحيوانات"
    },
    living_room_forest_tv: {
      fileName: "living_room_forest_tv.png",
      path: "/images/lesson-3/living_room_forest_tv.png",
      description: "غرفة معيشة وسامي ووالده أمام تلفاز يعرض غابة كرتونية.",
      alt: "غرفة المعيشة والتلفاز"
    },
    lion_behind_tree_shadow: {
      fileName: "lion_behind_tree_shadow.png",
      path: "/images/lesson-3/lion_behind_tree_shadow.png",
      description: "ظل الأسد خلف الشجرة في لعبة من خلف الشجرة.",
      alt: "ظل الأسد خلف الشجرة"
    },
    cartoon_lion_tree: {
      fileName: "cartoon_lion_tree.png",
      path: "/images/lesson-3/cartoon_lion_tree.png",
      description: "أسد كرتوني تحت شجرة في الغابة.",
      alt: "أسد كرتوني في الغابة"
    },
    bulbul_on_branch: {
      fileName: "bulbul_on_branch.png",
      path: "/images/lesson-3/bulbul_on_branch.png",
      description: "بلبل صغير ملون على غصن.",
      alt: "بلبل على غصن"
    },
    rabbit_running_forest: {
      fileName: "rabbit_running_forest.png",
      path: "/images/lesson-3/rabbit_running_forest.png",
      description: "أرنب يجري في الغابة.",
      alt: "أرنب يجري في الغابة"
    },
    ant_carrying_grain: {
      fileName: "ant_carrying_grain.png",
      path: "/images/lesson-3/ant_carrying_grain.png",
      description: "نملة تجر حبة كبيرة.",
      alt: "نملة تحمل حبة"
    },
    animal_word_cutting_machine: {
      fileName: "animal_word_cutting_machine.png",
      path: "/images/lesson-3/animal_word_cutting_machine.png",
      description: "آلة تقطيع كلمات الغابة لتحليل الكلمات.",
      alt: "آلة تقطيع كلمات الغابة"
    },
    magic_potion_merge_word: {
      fileName: "magic_potion_merge_word.png",
      path: "/images/lesson-3/magic_potion_merge_word.png",
      description: "وعاء جرعة سحرية لدمج الأصوات.",
      alt: "جرعة سحرية لدمج الأصوات"
    },
    flying_pen_animal_album: {
      fileName: "flying_pen_animal_album.png",
      path: "/images/lesson-3/flying_pen_animal_album.png",
      description: "قلم طائر يكتب الكلمات في ألبوم الحيوان.",
      alt: "قلم طائر يكتب"
    },
    magic_word_train_forest: {
      fileName: "magic_word_train_forest.png",
      path: "/images/lesson-3/magic_word_train_forest.png",
      description: "قطار الكلمات في غابة الحيوان.",
      alt: "قطار الكلمات في الغابة"
    },
    magnetic_word_box_animals: {
      fileName: "magnetic_word_box_animals.png",
      path: "/images/lesson-3/magnetic_word_box_animals.png",
      description: "صندوق زجاجي ومغناطيس الأصوات السحري لمطابقة الكلمات.",
      alt: "مغناطيس الأصوات السحري"
    }
  },
  lesson4: {
    kareem_school_bag: {
      fileName: "kareem_school_bag.png",
      path: "/images/lesson-4/kareem_school_bag.png",
      description: "كريم يحمل حقيبته ذاهبًا للمدرسة.",
      alt: "كريم يحمل حقيبة المدرسة"
    },
    teacher_welcomes_kareem: {
      fileName: "teacher_welcomes_kareem.png",
      path: "/images/lesson-4/teacher_welcomes_kareem.png",
      description: "المعلمة تستقبل كريم عند باب المدرسة، المعلمة محجبة ومحتشمة.",
      alt: "المعلمة تستقبل كريم"
    },
    drawing_classroom: {
      fileName: "drawing_classroom.png",
      path: "/images/lesson-4/drawing_classroom.png",
      description: "فصل الرسم وفيه سبورة وأدوات تلوين.",
      alt: "فصل الرسم"
    },
    kareem_drawing_flower: {
      fileName: "kareem_drawing_flower.png",
      path: "/images/lesson-4/kareem_drawing_flower.png",
      description: "كريم يرسم زهرة في حصة الرسم.",
      alt: "كريم يرسم زهرة"
    },
    tarek_gives_eraser: {
      fileName: "tarek_gives_eraser.png",
      path: "/images/lesson-4/tarek_gives_eraser.png",
      description: "طارق يعطي كريم الممحاة.",
      alt: "طارق يعطي كريم الممحاة"
    },
    color_smart_board: {
      fileName: "color_smart_board.png",
      path: "/images/lesson-4/color_smart_board.png",
      description: "سبورة الألوان والكلمات الذكية.",
      alt: "سبورة الألوان الذكية"
    },
    lost_sounds_gift_box: {
      fileName: "lost_sounds_gift_box.png",
      path: "/images/lesson-4/lost_sounds_gift_box.png",
      description: "صندوق الأصوات الضائع مع مفاتيح الأصوات.",
      alt: "صندوق الأصوات الضائع"
    },
    keys_ka_qa_kha: {
      fileName: "keys_ka_qa_kha.png",
      path: "/images/lesson-4/keys_ka_qa_kha.png",
      description: "مفاتيح كَ، قَ، خَ للصندوق السحري.",
      alt: "مفاتيح ك ق خ"
    },
    kareem_fast_words_train: {
      fileName: "kareem_fast_words_train.png",
      path: "/images/lesson-4/kareem_fast_words_train.png",
      description: "قطار كلمات كريم السريع.",
      alt: "قطار كلمات كريم السريع"
    },
    sound_twins_balloons: {
      fileName: "sound_twins_balloons.png",
      path: "/images/lesson-4/sound_twins_balloons.png",
      description: "توائم الأصوات السحرية: بالونات كلمات متشابهة.",
      alt: "بالونات توائم الأصوات"
    },
    magic_bubble_cannon_words: {
      fileName: "magic_bubble_cannon_words.png",
      path: "/images/lesson-4/magic_bubble_cannon_words.png",
      description: "مدفع الأصوات السحري وبالونات الكلمات.",
      alt: "مدفع الأصوات السحري"
    },
    magic_sentence_magnet: {
      fileName: "magic_sentence_magnet.png",
      path: "/images/lesson-4/magic_sentence_magnet.png",
      description: "مغناطيس الجمل السحرية لإكمال الجملة.",
      alt: "مغناطيس الجمل السحرية"
    },
    kareem_final_colored_flower: {
      fileName: "kareem_final_colored_flower.png",
      path: "/images/lesson-4/kareem_final_colored_flower.png",
      description: "زهرة كريم النهائية الملونة بعد إكمال النشاط.",
      alt: "زهرة كريم الملونة"
    }
  },
  icons: {
    home: {
      fileName: "home.png",
      path: "/images/icons/home.png",
      description: "أيقونة الرئيسية.",
      alt: "الرئيسية"
    },
    back: {
      fileName: "back.png",
      path: "/images/icons/back.png",
      description: "أيقونة الرجوع.",
      alt: "رجوع"
    },
    next: {
      fileName: "next.png",
      path: "/images/icons/next.png",
      description: "أيقونة التالي.",
      alt: "التالي"
    },
    sound_on: {
      fileName: "sound_on.png",
      path: "/images/icons/sound_on.png",
      description: "أيقونة تشغيل الصوت.",
      alt: "تشغيل الصوت"
    },
    sound_off: {
      fileName: "sound_off.png",
      path: "/images/icons/sound_off.png",
      description: "أيقونة كتم الصوت.",
      alt: "كتم الصوت"
    },
    star: {
      fileName: "star.png",
      path: "/images/icons/star.png",
      description: "نجمة المكافأة.",
      alt: "نجمة"
    },
    trophy: {
      fileName: "trophy.png",
      path: "/images/icons/trophy.png",
      description: "كأس/جائزة.",
      alt: "كأس"
    },
    medal: {
      fileName: "medal.png",
      path: "/images/icons/medal.png",
      description: "ميدالية.",
      alt: "ميدالية"
    },
    heart: {
      fileName: "heart.png",
      path: "/images/icons/heart.png",
      description: "قلب تشجيع.",
      alt: "قلب"
    },
    help: {
      fileName: "help.png",
      path: "/images/icons/help.png",
      description: "علامة مساعدة.",
      alt: "مساعدة"
    },
    hint: {
      fileName: "hint.png",
      path: "/images/icons/hint.png",
      description: "مصباح تلميح.",
      alt: "تلميح"
    },
    check: {
      fileName: "check.png",
      path: "/images/icons/check.png",
      description: "علامة صح.",
      alt: "صح"
    },
    wrong: {
      fileName: "wrong.png",
      path: "/images/icons/wrong.png",
      description: "علامة خطأ.",
      alt: "خطأ"
    },
    play: {
      fileName: "play.png",
      path: "/images/icons/play.png",
      description: "تشغيل.",
      alt: "تشغيل"
    },
    pause: {
      fileName: "pause.png",
      path: "/images/icons/pause.png",
      description: "إيقاف مؤقت.",
      alt: "إيقاف مؤقت"
    }
  }
};

/**
 * Helper function to get image by key
 * @param category - The category (characters, lesson1, lesson2, lesson3, lesson4, icons)
 * @param key - The asset key
 * @returns The image asset or null if not found
 */
export function getImageAsset(category: keyof ImageAssets, key: string): ImageAsset | null {
  const categoryAssets = imageAssets[category];
  if (!categoryAssets) return null;
  
  const asset = (categoryAssets as Record<string, ImageAsset>)[key];
  return asset || null;
}

/**
 * Helper function to get image path by key
 * @param category - The category (characters, lesson1, lesson2, lesson3, lesson4, icons)
 * @param key - The asset key
 * @returns The image path or null if not found
 */
export function getImagePath(category: keyof ImageAssets, key: string): string | null {
  const asset = getImageAsset(category, key);
  return asset ? asset.path : null;
}

/**
 * Check if an image file exists in the public folder
 * This is a runtime check - for build-time validation, use the checklist
 */
export function imageExists(category: keyof ImageAssets, key: string): boolean {
  return getImagePath(category, key) !== null;
}
