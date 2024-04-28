import React from 'react';

const Experience = ({ title, items }) => (
  <div className="experience">
    <h2>{title}</h2>
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  </div>
);

const App = () => {
  const university = {
    title: 'University',
    items: [
      { label: 'University Name', value: 'University of Minnesota - Twin Cities' },
      { label: 'Degree', value: 'B.S Computer Science' },
      { label: 'Dates', value: '2022 - 2025' },
    ],
  };

  const workExperiences = [
   { title: 'Work Experience1',
    items: [
      { label: 'Company', value: 'Dept. of Computer Science and Engineering' },
      { label: 'Position', value: 'Teaching Assistant' },
      { label: 'Dates', value: '2024 - Present' },
    ],
  },
  { title: 'Work Experience2',
    items: [
      { label: 'Company', value: 'Office of Information Technology' },
      { label: 'Position', value: 'Service Desk Training Mentor' },
      { label: 'Dates', value: '2023 - 2024' },
    ],
  },
  { title: 'Work Experience3',
    items: [
      { label: 'Position', value: 'Service Desk Technician' },
      { label: 'Dates', value: '2023 - 2024' },
    ],
  }

  ]

  return (
    <div>
      <Experience title={university.title} items={university.items} />
      {workExperiences.map((experience, index) => (
        <Experience key={index} title={experience.title} items={experience.items} />
      ))}
    </div>
  );
};

export default App;