import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Table,
  Icon,
  Switch,
  Alert,
  message,
  Spin,
  Progress,
} from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import { ColumnProps } from 'antd/lib/table';
import moment, { Moment } from 'moment';
import './TabsWeekDays.css';
import { ITrimester, ILessonOld } from '../constants';

const TabPane = Tabs.TabPane;

/** WeekDayNames - названия дней недели */
const wdn = 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split(
  '_'
);

interface ILessonType {
  shortName: string;
  fullName: string;
  className: string;
}

const LessonTypes: ILessonType[] = [
  { shortName: 'вне', fullName: 'внеучебное занятие', className: 'lek0' },
  { shortName: 'л', fullName: 'лекция', className: 'lek1' },
  { shortName: 'пр', fullName: 'практическое занятие', className: 'lek2' },
  { shortName: 'лаб', fullName: 'лабораторная работа', className: 'lek3' },
  { shortName: 'зач', fullName: 'зачет', className: 'lek4' },
  { shortName: 'экз', fullName: 'экзамен', className: 'lek5' },
  { shortName: 'конс', fullName: 'консультация', className: 'lek6' },
  { shortName: 'п/с', fullName: 'пересдача', className: 'lek7' },
  { shortName: '', fullName: 'внеплановое занятие', className: 'lek8' },
  { shortName: 'тест', fullName: 'тестирование', className: 'lek9' },
  { shortName: 'подг', fullName: 'подготовительные курсы', className: 'lek10' },
  { shortName: 'ол', fullName: 'олимпиада', className: 'lek11' },
  { shortName: 'конф', fullName: 'научная конференция', className: 'lek12' },
  { shortName: 'откр', fullName: 'день открытых дверей', className: 'lek13' },
];

const columns: ColumnProps<ILessonOld>[] = [
  {
    key: 'first',
    className: 'StartTime_Room',
    render: (text: any, record: ILessonOld, index: number) => {
      return (
        <React.Fragment>
          <div className="StartTime">
            <Icon type="clock-circle" /> {record.StartTime}
          </div>
          <div className="Room">
            <Icon type="environment" /> {record.Room}
          </div>
        </React.Fragment>
      );
    },
  },
  {
    key: 'second',
    render: (text: any, record: ILessonOld, index: number) => {
      const lessonType =
        LessonTypes.find(type => type.shortName === record.LessonType) ||
        LessonTypes[0];
      return (
        <>
          <div>
            <span
              title={lessonType.fullName}
              className={`LessonType ${lessonType.className}`}
            >
              {record.LessonType}
            </span>
            &nbsp;
            {record.Lesson}
          </div>
          <div title={record.FIO}>
            <Icon type="user" /> {record.FIO}
          </div>
        </>
      );
    },
  },
];

interface Props {
  loading: boolean;
  schedule: ILessonOld[];
  week_number: number;
  week_total: number;
  trimester: any;
}

interface IWeekDay {
  name: string;
  lessons: ILessonOld[];
}

function TabsWeekDays(props: Props) {
  const [tabPosition, setTabPosition] = useState<TabsPosition>('top');
  const [parity, setParity] = useState(false);
  /** Вкладка (день недели), которая будет открыта при загрузке */
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('1');

  const today = moment();

  useEffect(() => {
    const handleResize = () => {
      setTabPosition(window.innerWidth > window.innerHeight ? 'left' : 'top');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Поиск ближайшего следующего дня для которого есть расписание
  useEffect(() => {
    let parity = (props.week_number + 15) % 2 === 0;
    const todayWeekday = today.isoWeekday();
    let minWeekday = props.schedule
      .map(v => v.WeekDay)
      .reduce((min, weekday, i) => {
        const lesson = props.schedule[i];
        if (lesson.Odd === 0 && weekday < todayWeekday) {
          // пара каждую неделю и на этой неделе этот день уже прошел
          // => пара будет на следующей
          weekday += 7;
        } else if (
          (lesson.Odd === 1 && parity) ||
          (lesson.Odd === 2 && !parity)
        ) {
          // пара не на этой неделе
          weekday += 7;
        } else if (weekday < todayWeekday) {
          // пара на этой неделе, но день уже прошел
          weekday += 14;
        }
        return Math.min(min, weekday);
      }, 15); // здесь минимальным днем передаем максимально невозможное число

    // We need to correct minWeekday value a little bit
    if (minWeekday > 14) {
      minWeekday -= 14;
    } else if (minWeekday > 7) {
      // если пара в день на следующей неделе, надо поменять четность
      minWeekday -= 7;
      parity = !parity;
    }
    setParity(parity);
    setDefaultActiveKey(String(minWeekday));
  }, [props.schedule]);

  const handleParityChange = (parity: boolean) => {
    setParity(parity);
    message.info(`Показана ${parity ? 'четная' : 'нечетная'} неделя`, 1);
  };

  let weekdays: IWeekDay[] = [];

  for (let i = 1; i <= 7; i++) {
    weekdays[i] = {
      name: wdn[i],
      lessons: [],
    };
  }

  if (props.loading) return <Spin />;

  if (!props.schedule || props.schedule.length <= 1)
    return <div>К сожалению, для этой группы нет расписания</div>;

  for (let s of props.schedule) {
    if (
      !s.Error &&
      (s.Odd === 0 || (parity && s.Odd === 2) || (!parity && s.Odd === 1))
    )
      weekdays[s.WeekDay].lessons.push(s);
  }

  const tabsContent = weekdays.map((weekday, i) => {
    if (weekday.lessons.length > 0)
      return (
        <TabPane tab={weekday.name} key={String(i)}>
          <Table
            dataSource={weekday.lessons}
            columns={columns}
            size="small"
            className="Schedule"
            showHeader={false}
            pagination={false}
            rowKey={r =>
              r.WeekDay + r.StartTime + r.Odd + r.Lesson + r.LessonType + r.FIO
            }
          />
        </TabPane>
      );
    else return null;
  });
  // TODO с переменными и вычеслениями нужно будет навести порядок
  const {
    dateStart,
    dateFinish,
  }: { dateStart: Moment; dateFinish: Moment } = props.trimester;
  const d = {
    today: today.valueOf(),
    start: dateStart.valueOf(),
    finish: dateFinish.valueOf(),
  };
  const trimesterProgress = Math.round(
    ((d.today - d.start) / (d.finish - d.start)) * 100
  );
  return (
    <>
      <div>
        Сегодня {wdn[today.isoWeekday() % 7]}, {today.format('LL')}{' '}
        {/* @TODO I need to do something with weeks and semesters */}
        неделя в семестре {props.week_number} из {props.week_total}, неделя в
        году {props.week_number + 15} из {props.week_total + 15} (
        {(props.week_number + 15) % 2 === 0 ? 'Четная' : 'Нечетная'})
      </div>
      <div>
        Прогресс семестра ({dateStart.format('L')} - {dateFinish.format('L')}):
      </div>
      <Progress percent={trimesterProgress} />
      {props.week_number > props.week_total && (
        <Alert
          type="warning"
          showIcon
          message="Учебный семестр закончился. Сейчас отображается расписание прошедшего семестра."
        />
      )}
      <div className="switch-parity">
        Показать неделю: &nbsp;
        <Switch
          checkedChildren="ч"
          unCheckedChildren="н"
          checked={parity}
          onChange={handleParityChange}
        />
      </div>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        tabPosition={tabPosition}
        animated={false}
      >
        {tabsContent}
      </Tabs>
    </>
  );
}

export default TabsWeekDays;
