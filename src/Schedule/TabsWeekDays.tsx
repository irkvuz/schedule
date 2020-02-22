import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { message, Spin, Switch, Table, Tabs } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { TabsPosition } from 'antd/lib/tabs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ILessonOld, WEEK_DAY_NAMES } from '../constants';
import './TabsWeekDays.css';
import { findNearestDay } from './findNearestDay';

const TabPane = Tabs.TabPane;

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
            <ClockCircleOutlined /> {record.StartTime}
          </div>
          <div className="Room">
            <EnvironmentOutlined /> {record.Room}
          </div>
        </React.Fragment>
      );
    },
  },
  {
    key: 'second',
    render: (text: any, record: ILessonOld, index: number) => {
      const lessonType =
        LessonTypes.find((type) => type.shortName === record.LessonType) ||
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
            <UserOutlined /> {record.FIO}
          </div>
        </>
      );
    },
  },
];

interface Props {
  loading: boolean;
  schedule?: ILessonOld[];
  week_number: number;
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

  useEffect(() => {
    if (props.schedule === undefined) return;
    const { minWeekday, parity } = findNearestDay({
      week_number: props.week_number,
      weekday: moment().isoWeekday(),
      schedule: props.schedule,
    });
    setDefaultActiveKey(String(minWeekday));
    setParity(parity);
  }, [props.schedule, props.week_number]);

  const handleParityChange = (parity: boolean) => {
    setParity(parity);
    message.info(`Показана ${parity ? 'четная' : 'нечетная'} неделя`, 1);
  };

  if (props.loading) return <Spin data-testid="loading-spinner" />;

  let weekdays: IWeekDay[] = [];

  for (let i = 1; i <= 7; i++) {
    weekdays[i] = {
      name: WEEK_DAY_NAMES[i],
      lessons: [],
    };
  }

  if (!props.schedule || props.schedule.length <= 1) {
    return <div>К сожалению, для этой группы нет расписания</div>;
  }

  for (let s of props.schedule) {
    if (
      !s.Error &&
      (s.Odd === 0 || (parity && s.Odd === 2) || (!parity && s.Odd === 1))
    ) {
      weekdays[s.WeekDay].lessons.push(s);
    }
  }

  const tabsContent = weekdays.map((weekday, i) => {
    if (weekday.lessons.length === 0) return null;
    return (
      <TabPane tab={weekday.name} key={String(i)}>
        <Table
          dataSource={weekday.lessons}
          columns={columns}
          size="small"
          className="Schedule"
          showHeader={false}
          pagination={false}
          rowKey={(r) =>
            r.WeekDay + r.StartTime + r.Odd + r.Lesson + r.LessonType + r.FIO
          }
        />
      </TabPane>
    );
  });

  return (
    <>
      {/* TODO This block should be moved to it's own component `WeekParitySwitcher` */}
      <div className="switch-parity">
        Показать неделю: &nbsp;
        <Switch
          checkedChildren="ч"
          unCheckedChildren="н"
          checked={parity}
          onChange={handleParityChange}
          data-testid="week-parity-switcher"
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
