const fs = require('fs');

const dir = 'public/data/schedule/1171/';

const files = fs.readdirSync(dir);

const separator = '\t';
const columns = [
  'group',
  'WeekDay',
  'StartTime',
  'Odd',
  'Room',
  'LessonType',
  'FIO',
  'Lesson',
];
let csv = columns.join(separator) + '\n';

files.forEach((file, index) => {
  const schedule = JSON.parse(
    fs.readFileSync(dir + file, { encoding: 'utf-8' })
  );

  schedule.forEach((l, index) => {
    const row = [
      file.split('.')[0],
      l.WeekDay,
      l.StartTime,
      l.Odd,
      l.Room,
      l.LessonType,
      l.FIO,
      l.Lesson,
    ];
    csv += row.join(separator) + `\n`;
  });
});

fs.writeFileSync('schedule.csv', csv);
