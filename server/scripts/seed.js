const dotenv = require("dotenv");
dotenv.config();

const { connectDb } = require("../src/config/db");
const Major = require("../src/models/Major");
const Career = require("../src/models/Career");
const Post = require("../src/models/Post");
const Video = require("../src/models/Video");

async function seed() {
  await connectDb(process.env.MONGODB_URI);

  const majors = [
    {
      slug: "information-technology",
      title: "Information Technology",
      titleKm: "បច្ចេកវិទ្យាព័ត៌មាន",
      description: "Learn how to build, run, and secure computer systems and applications.",
      descriptionKm: "សិក្សាអំពីការបង្កើត ដំណើរការ និងការពារប្រព័ន្ធកុំព្យូទ័រ និងកម្មវិធី។",
      imageUrl: "/images/majors/information-technology.svg",
      skills: ["Programming basics", "Networking", "Databases", "Problem solving"],
      skillsKm: ["មូលដ្ឋានការសរសេរកូដ", "បណ្តាញកុំព្យូទ័រ", "មូលដ្ឋានទិន្នន័យ", "ដោះស្រាយបញ្ហា"],
      careers: ["Software Developer", "Network Engineer", "IT Support"],
      careersKm: ["អ្នកអភិវឌ្ឍកម្មវិធី", "វិស្វករបណ្តាញ", "ជំនួយផ្នែក IT"]
    },
    {
      slug: "business-administration",
      title: "Business Administration",
      titleKm: "គ្រប់គ្រងពាណិជ្ជកម្ម",
      description: "Study management, finance, marketing, and how organizations operate.",
      descriptionKm: "សិក្សាអំពីការគ្រប់គ្រង ហិរញ្ញវត្ថុ ទីផ្សារ និងរបៀបអង្គភាពដំណើរការ។",
      imageUrl: "/images/majors/business-administration.svg",
      skills: ["Communication", "Planning", "Teamwork", "Data literacy"],
      skillsKm: ["ការទំនាក់ទំនង", "រៀបចំផែនការ", "ធ្វើការជាក្រុម", "យល់ដឹងអំពីទិន្នន័យ"],
      careers: ["Project Coordinator", "Marketing Specialist", "Entrepreneur"],
      careersKm: ["អ្នកសម្របសម្រួលគម្រោង", "អ្នកជំនាញទីផ្សារ", "សហគ្រិន"]
    },
    {
      slug: "graphic-design",
      title: "Graphic Design",
      titleKm: "រចនាក្រាហ្វិក",
      description: "Create visual communication for brands, products, and media.",
      descriptionKm: "បង្កើតការទំនាក់ទំនងតាមរូបភាពសម្រាប់ម៉ាក ផលិតផល និងមេឌៀ។",
      imageUrl: "/images/majors/graphic-design.svg",
      skills: ["Typography", "Color theory", "Design tools", "Storytelling"],
      skillsKm: ["អក្សររចនា", "ទ្រឹស្តីពណ៌", "ឧបករណ៍រចនា", "ការនិទានរឿង/បង្ហាញគំនិត"],
      careers: ["Graphic Designer", "UI Designer", "Content Creator"],
      careersKm: ["អ្នករចនាក្រាហ្វិក", "អ្នករចនា UI", "អ្នកបង្កើតមាតិកា"]
    }
  ];

  const careers = [
    {
      slug: "software-developer",
      title: "Software Developer",
      titleKm: "អ្នកអភិវឌ្ឍកម្មវិធី",
      description: "Build applications that solve problems for people and businesses.",
      descriptionKm: "បង្កើតកម្មវិធីដើម្បីដោះស្រាយបញ្ហាសម្រាប់មនុស្ស និងអាជីវកម្ម។",
      skills: ["JavaScript", "Problem solving", "Git", "Communication"],
      skillsKm: ["JavaScript", "ដោះស្រាយបញ្ហា", "Git", "ការទំនាក់ទំនង"],
      roadmap: [
        {
          step: "Learn programming fundamentals",
          stepKm: "រៀនមូលដ្ឋានការសរសេរកូដ",
          details: "Variables, loops, functions.",
          detailsKm: "អថេរ, លូប, មុខងារ។"
        },
        {
          step: "Learn web basics",
          stepKm: "រៀនមូលដ្ឋាន Web",
          details: "HTML, CSS, JavaScript.",
          detailsKm: "HTML, CSS, JavaScript។"
        },
        {
          step: "Build projects",
          stepKm: "បង្កើតគម្រោង",
          details: "Portfolio projects, GitHub.",
          detailsKm: "គម្រោងសម្រាប់ Portfolio និង GitHub។"
        },
        {
          step: "Apply for internships/jobs",
          stepKm: "ដាក់ពាក្យ Internship/Job",
          details: "CV, interview practice.",
          detailsKm: "CV និងហ្វឹកហាត់សម្ភាសន៍។"
        }
      ]
    },
    {
      slug: "graphic-designer",
      title: "Graphic Designer",
      titleKm: "អ្នករចនាក្រាហ្វិក",
      description: "Design visuals for marketing, products, and communication.",
      descriptionKm: "រចនារូបភាពសម្រាប់ទីផ្សារ ផលិតផល និងការទំនាក់ទំនង។",
      skills: ["Design principles", "Figma/Adobe tools", "Creativity", "Feedback"],
      skillsKm: ["គោលការណ៍រចនា", "ឧបករណ៍ Figma/Adobe", "ភាពច្នៃប្រឌិត", "ទទួលយកមតិយោបល់"],
      roadmap: [
        {
          step: "Learn design principles",
          stepKm: "រៀនគោលការណ៍រចនា",
          details: "Layout, typography, color.",
          detailsKm: "Layout, អក្សររចនា និងពណ៌។"
        },
        {
          step: "Practice tools",
          stepKm: "ហ្វឹកហាត់ឧបករណ៍",
          details: "Figma or Adobe apps.",
          detailsKm: "Figma ឬកម្មវិធី Adobe។"
        },
        {
          step: "Build a portfolio",
          stepKm: "បង្កើត Portfolio",
          details: "Posters, logos, UI screens.",
          detailsKm: "ប៉ូស្ទ័រ, ឡូហ្គូ និង UI screens។"
        },
        {
          step: "Find clients or jobs",
          stepKm: "រកអតិថិជន ឬការងារ",
          details: "Freelance platforms or agencies.",
          detailsKm: "វេទិកា Freelance ឬក្រុមហ៊ុន/Agency។"
        }
      ]
    }
  ];

  const posts = [
    {
      slug: "how-to-choose-a-major",
      title: "How to choose a major (simple guide)",
      titleKm: "របៀបជ្រើសរើសមុខជំនាញ (មគ្គុទេសក៍សង្ខេប)",
      excerpt: "A practical checklist to choose your major with confidence.",
      excerptKm: "បញ្ជីត្រួតពិនិត្យងាយៗ ដើម្បីជ្រើសរើសមុខជំនាញដោយមានទំនុកចិត្ត។",
      coverImageUrl: "/images/posts/how-to-choose-a-major.svg",
      content:
        "Start with your interests, then match them with skills you enjoy building. Talk to seniors, try small projects, and review job options in Cambodia.",
      contentKm:
        "ចាប់ផ្តើមពីចំណូលចិត្តរបស់អ្នក បន្ទាប់មកភ្ជាប់ទៅជំនាញដែលអ្នកចូលចិត្តបង្កើត។ ពិភាក្សាជាមួយបងប្អូន/សិស្សជាន់លើ សាកល្បងគម្រោងតូចៗ ហើយពិនិត្យជម្រើសការងារនៅកម្ពុជា។",
      tags: ["major", "students"]
    },
    {
      slug: "skills-for-the-future",
      title: "Skills needed for the future",
      titleKm: "ជំនាញសម្រាប់អនាគត",
      excerpt: "Skills that help you adapt in a fast-changing world.",
      excerptKm: "ជំនាញដែលជួយអ្នកសម្របខ្លួនក្នុងពិភពដែលផ្លាស់ប្តូរលឿន។",
      coverImageUrl: "/images/posts/skills-for-the-future.svg",
      content:
        "Communication, problem solving, digital literacy, and continuous learning are powerful across many careers.",
      contentKm:
        "ការទំនាក់ទំនង ដោះស្រាយបញ្ហា ជំនាញឌីជីថល និងការរៀនជានិច្ច គឺមានសារៈសំខាន់សម្រាប់អាជីពជាច្រើន។",
      tags: ["skills", "career"]
    }
  ];

  const videos = [
    {
      slug: "how-to-choose-a-major",
      title: "How to choose a major (step-by-step)",
      titleKm: "របៀបជ្រើសរើសមុខជំនាញ (ជំហានៗ)",
      description:
        "A simple process: interests → skills → majors → careers. Use this video before you decide.",
      descriptionKm:
        "ដំណើរការងាយៗ៖ ចំណូលចិត្ត → ជំនាញ → មុខជំនាញ → អាជីព។ សូមមើលវីដេអូនេះមុនពេលសម្រេចចិត្ត។",
      url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      tags: ["major", "students"]
    },
    {
      slug: "skills-for-the-future",
      title: "Skills for the future (students)",
      titleKm: "ជំនាញសម្រាប់អនាគត (សិស្ស)",
      description: "Top skills: communication, problem solving, digital skills, and learning mindset.",
      descriptionKm: "ជំនាញសំខាន់ៗ៖ ទំនាក់ទំនង ដោះស្រាយបញ្ហា ជំនាញឌីជីថល និងចិត្តសាស្ត្ររៀនជានិច្ច។",
      url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      tags: ["skills"]
    }
  ];

  await Major.deleteMany({});
  await Career.deleteMany({});
  await Post.deleteMany({});
  await Video.deleteMany({});

  await Major.insertMany(majors);
  await Career.insertMany(careers);
  await Post.insertMany(posts);
  await Video.insertMany(videos);

  // eslint-disable-next-line no-console
  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
