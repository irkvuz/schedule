const fs = require('fs');
const dir = 'public/data/schedule/1171/';

const separator = '\t';
const columns = [
  'facultyName',
  'groupName',
  'WeekDay',
  'StartTime',
  'Odd',
  'Room',
  'LessonType',
  'FIO',
  'Lesson',
  'isOnline', // TMP
];
let tsv = columns.join(separator) + '\n';


const faculties = require('../public/data/facultiesWithGroups.json');

for (let f of faculties) {
  for (let g of f.groups) {
    const schedule = JSON.parse(
      fs.readFileSync(dir + `${g.id}.json`, { encoding: 'utf-8' })
    );

    for (let l of schedule) {
      const isOnline = l.Room.search('Онлайн') !== -1; // TMP
      const row = [
        f.name,
        g.name,
        l.WeekDay,
        l.StartTime,
        l.Odd,
        l.Room,
        l.LessonType,
        l.FIO,
        l.Lesson,
        isOnline, // TMP
      ];
      tsv += row.join(separator) + `\n`;
    };
  }
}



fs.writeFileSync('schedule.tsv', tsv);
