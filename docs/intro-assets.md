# Intro Assets

## Audio keys

The intro flow uses the existing MP3-first `useTTS` audio path and these files under `public/audio/ui`:

| Key | Missing MP3 | Narration text |
| --- | --- | --- |
| `official_intro_scene_1` | `public/audio/ui/official_intro_scene_1.mp3` | مرحبًا بكم في هذا التطبيق التعليمي، المُهدي من جامعة الأزهر الشريف، كلية التربية بنين بالقاهرة، قسم المناهج وطرق التدريس. |
| `official_intro_scene_2` | `public/audio/ui/official_intro_scene_2.mp3` | هذا العمل مقدم استكمالًا لمتطلبات الحصول على درجة المَاجِسْتِر في التربية، تخصص مناهج وطرق تدريس اللغة العربية. من إعداد الباحث: مصطفى أحمد محمد حسن حسان، معلم اللغة العربية بوزارة التربية والتعليم. |
| `official_intro_scene_3` | `public/audio/ui/official_intro_scene_3.mp3` | ويأتي هذا العمل تحت إشراف نخبة من العلماء الأجلاء: الأستاذ الدكتور خالد فاروق الهواري، الدكتور باسم محمد عبده الجندي، والدكتور أشرف محمد سعد، أساتذة المناهج وطرق التدريس بكلية التربية بجامعة الأزهر. |
| `welcome_intro_scene_1` | `public/audio/ui/welcome_intro_scene_1.mp3` | عزيزي تلميذ الصف الأول الابتدائي، أهلًا ومرحبًا بك يا بطل في رحلة ممتعة وشيقة، مليئة بالألعاب اللغوية الإلكترونية المرتبطة بالأصوات والحروف الجميلة. |
| `welcome_intro_scene_2` | `public/audio/ui/welcome_intro_scene_2.mp3` | عزيزي التلميذ، في هذا التطبيق سوف تتعلم كيف تسمع الأصوات، وتتعرف على الحروف والكلمات، وتحليلها ودمجها بطريقة سهلة ومرحة. |
| `welcome_intro_scene_3` | `public/audio/ui/welcome_intro_scene_3.mp3` | هيا بنا عزيزي التلميذ ننطلق! نلعب ونتعلم الأصوات والحروف في مغامرات ممتعة تساعدك على التمييز بين الأصوات، والتعرف على الحروف، وبناء مهاراتك خطوة بخطوة. |

The UI keeps showing the narration text and advances by scene timing if an MP3 is not present.

## Visual placeholders

The current implementation uses CSS/motion placeholders that match the app palette:

| Scene | Placeholder |
| --- | --- |
| Official scene 1 | Al-Azhar-inspired minarets, morning light, and soft flying marks. |
| Official scene 2 | Opening Arabic book and floating Arabic letters. |
| Official scene 3 | Golden honor board and writing pen motion. |
| Welcome scene 1 | Colorful learning gate, Arabic letters, and two student avatars. |
| Welcome scene 2 | Floating skill island, merging letters, and split syllable blocks. |
| Welcome scene 3 | Flying train and golden start cloud. |

Replace these with final illustrated assets later if official artwork is supplied.

## Replay/reset

The intro is marked complete with `localStorage` key `introSeen`.

To replay during development, open `/?intro=replay`.

To reset manually in the browser console:

```js
localStorage.removeItem("introSeen")
```
