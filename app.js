const STORAGE_KEY = "courseFinderCourses";

const seedCourses = [
  {
    id: "seed-1",
    name: "Front-End Development Fundamentals",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    category: "Technology",
    institute: "Future Skills Institute",
    start: "2026-06-01",
    end: "2026-07-10",
    daysLength: "40",
    male: true,
    female: true,
    maleInstructor: "Omar Khaled",
  },
  {
    id: "seed-2",
    name: "Business English for Professionals",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    category: "Language",
    institute: "Global Learning Center",
    start: "2026-06-15",
    end: "2026-07-05",
    daysLength: "21",
    male: true,
    female: false,
    maleInstructor: "Yousef Ali",
  },
  {
    id: "seed-3",
    name: "Digital Marketing Strategy",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    category: "Marketing",
    institute: "Creative Academy",
    start: "2026-07-01",
    end: "2026-08-12",
    daysLength: "43",
    male: false,
    female: true,
    maleInstructor: "Nasser Salem",
  },
];

const getCourses = () => {
  const savedCourses = localStorage.getItem(STORAGE_KEY);
  if (!savedCourses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCourses));
    return seedCourses;
  }

  try {
    return JSON.parse(savedCourses);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCourses));
    return seedCourses;
  }
};

const saveCourses = (courses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

const formatDate = (value) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
};

const getGenderText = (course) => {
  const genders = [];
  if (course.male) genders.push("Male");
  if (course.female) genders.push("Female");
  return genders.length ? genders.join(" and ") : "Not specified";
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const createCourseId = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `course-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const renderSearchPage = () => {
  const courseList = document.querySelector("#courses-list");
  if (!courseList) return;

  const template = document.querySelector("#course-card-template");
  const keywordInput = document.querySelector("#keyword");
  const categoryFilter = document.querySelector("#category-filter");
  const genderFilter = document.querySelector("#gender-filter");
  const resultCount = document.querySelector("#result-count");
  const searchForm = document.querySelector("#search-form");

  const populateCategories = () => {
    const categories = [...new Set(getCourses().map((course) => course.category).filter(Boolean))].sort();
    categoryFilter.innerHTML = '<option value="">All categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.append(option);
    });
  };

  const filterCourses = () => {
    const keyword = normalize(keywordInput.value);
    const category = normalize(categoryFilter.value);
    const gender = genderFilter.value;

    return getCourses().filter((course) => {
      const searchable = normalize([
        course.name,
        course.category,
        course.institute,
        course.maleInstructor,
        course.start,
        course.end,
        course.daysLength,
      ].join(" "));
      const matchesKeyword = !keyword || searchable.includes(keyword);
      const matchesCategory = !category || normalize(course.category) === category;
      const matchesGender = !gender || Boolean(course[gender]);
      return matchesKeyword && matchesCategory && matchesGender;
    });
  };

  const renderCourses = () => {
    const courses = filterCourses();
    courseList.innerHTML = "";
    resultCount.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} found`;

    if (!courses.length) {
      courseList.innerHTML = '<p class="empty-state">No courses match your search. Try changing the filters.</p>';
      return;
    }

    courses.forEach((course) => {
      const card = template.content.cloneNode(true);
      const image = card.querySelector(".course-image");
      image.src = course.image;
      image.alt = `${course.name} course image`;
      card.querySelector(".category").textContent = course.category;
      card.querySelector(".length").textContent = `${course.daysLength} days`;
      card.querySelector("h3").textContent = course.name;
      card.querySelector(".institute").textContent = course.institute;
      card.querySelector(".start").textContent = formatDate(course.start);
      card.querySelector(".end").textContent = formatDate(course.end);
      card.querySelector(".instructor").textContent = course.maleInstructor;
      card.querySelector(".genders").textContent = getGenderText(course);
      courseList.append(card);
    });
  };

  populateCategories();
  renderCourses();
  [keywordInput, categoryFilter, genderFilter].forEach((field) => field.addEventListener("input", renderCourses));
  searchForm.addEventListener("reset", () => window.setTimeout(renderCourses, 0));
};

const renderAdminPage = () => {
  const courseForm = document.querySelector("#course-form");
  if (!courseForm) return;

  const formMessage = document.querySelector("#form-message");
  const adminCourseList = document.querySelector("#admin-course-list");
  const clearCoursesButton = document.querySelector("#clear-courses");

  const renderAdminCourses = () => {
    const courses = getCourses();
    adminCourseList.innerHTML = "";

    if (!courses.length) {
      adminCourseList.innerHTML = '<p class="empty-state">No courses have been added yet.</p>';
      return;
    }

    courses.forEach((course) => {
      const item = document.createElement("article");
      const title = document.createElement("h3");
      const summary = document.createElement("p");
      const schedule = document.createElement("p");
      const genders = document.createElement("p");

      item.className = "admin-course-item";
      title.textContent = course.name;
      summary.textContent = `${course.category} • ${course.institute}`;
      schedule.textContent = `${formatDate(course.start)} - ${formatDate(course.end)} • ${course.daysLength} days`;
      genders.textContent = `Available for: ${getGenderText(course)}`;

      item.append(title, summary, schedule, genders);
      adminCourseList.append(item);
    });
  };

  courseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(courseForm);
    const course = {
      id: createCourseId(),
      name: formData.get("name"),
      image: formData.get("image"),
      category: formData.get("category"),
      institute: formData.get("institute"),
      start: formData.get("start"),
      end: formData.get("end"),
      daysLength: formData.get("daysLength"),
      male: formData.has("male"),
      female: formData.has("female"),
      maleInstructor: formData.get("maleInstructor"),
    };

    if (!course.male && !course.female) {
      formMessage.textContent = "Please select at least one availability option: Male or Female.";
      return;
    }

    if (course.end < course.start) {
      formMessage.textContent = "The end date must be after the start date.";
      return;
    }

    const courses = [course, ...getCourses()];
    saveCourses(courses);
    courseForm.reset();
    formMessage.textContent = "Course added successfully. It is now visible on the search page.";
    renderAdminCourses();
  });

  clearCoursesButton.addEventListener("click", () => {
    saveCourses([]);
    formMessage.textContent = "All courses have been cleared.";
    renderAdminCourses();
  });

  renderAdminCourses();
};

renderSearchPage();
renderAdminPage();
