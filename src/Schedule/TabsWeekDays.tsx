import React from 'react';
import { Tabs, Table, Icon, Switch, Alert, message } from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import './TabsWeekDays.css';

const TabPane = Tabs.TabPane;

const wdn = 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split(
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

export interface ILessonOld {
  WeekDay: number;
  StartTime: string;
  Odd: number;
  Lesson: string;
  LessonType: string;
  Room: string;
  FIO: string;
  FIOshort: string;
  Error: string | null;
}

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

interface TabsWeekDaysProps {
  schedule: ILessonOld[];
  week_number: number;
  week_total: number;
}

interface TabsWeekDaysState {
  tabsPosition: TabsPosition;
  parity: boolean;
  day: number;
  today: moment.Moment;
}

interface IWeekDay {
  name: string;
  lessons: ILessonOld[];
}

class TabsWeekDays extends React.Component<
  TabsWeekDaysProps,
  TabsWeekDaysState
> {
  constructor(props: TabsWeekDaysProps) {
    super(props);
    this.state = {
      tabsPosition: 'top',
      parity: (this.props.week_number + 15) % 2 === 0,
      day: moment().isoWeekday(),
      today: moment(),
    };
  }

  updateDimensions = () => {
    this.setState({
      tabsPosition: window.innerWidth > window.innerHeight ? 'left' : 'top',
    });
  };
  componentWillMount = () => {
    this.updateDimensions();
  };
  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions);
  };
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  };

  handleParityChange = (parity: boolean) => {
    this.setState({ parity });
    message.info(
      `Показано расписание ${parity ? 'четной' : 'нечетной'} недели`,
      1
    );
  };

  render() {
    console.log('Component TabsWeekDays props =', this.props);
    let weekdays: IWeekDay[] = [];
    for (let i = 1; i <= 6; i++) {
      weekdays[i] = {
        name: wdn[i],
        lessons: [],
      };
    }
    const { schedule } = this.props;
    if (!schedule) return <div>No data</div>;
    for (let s of schedule) {
      if (
        !s.Error &&
        (s.Odd === 0 ||
          (this.state.parity && s.Odd === 2) ||
          (!this.state.parity && s.Odd === 1))
      )
        weekdays[s.WeekDay].lessons.push(s);
    }
    const tabpanes = weekdays.map((wd, i) => {
      if (wd.lessons.length > 0)
        return (
          <TabPane tab={wd.name} key={String(i)}>
            <Table
              dataSource={wd.lessons}
              columns={columns}
              size="small"
              className="Schedule"
              showHeader={false}
              pagination={false}
              rowKey={r =>
                r.WeekDay +
                r.StartTime +
                r.Odd +
                r.Lesson +
                r.LessonType +
                r.FIO
              }
            />
          </TabPane>
        );
      else return null;
    });
    return (
      <>
        <div>
          Сегодня {wdn[this.state.day % 7]}, {this.state.today.format('LL')}{' '}
          {/* @TODO I need to do something with weeks and semesters */}
          неделя в семестре {this.props.week_number} из {this.props.week_total},
          неделя в году {this.props.week_number + 15} из{' '}
          {this.props.week_total + 15} (
          {(this.props.week_number + 15) % 2 === 0 ? 'Четная' : 'Нечетная'})
        </div>
        {this.props.week_number > this.props.week_total && (
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
            checked={this.state.parity}
            onChange={this.handleParityChange}
          />
        </div>
        <Tabs
          defaultActiveKey={this.state.day.toString()}
          tabPosition={this.state.tabsPosition}
          animated={false}
        >
          {tabpanes}
        </Tabs>
      </>
    );
  }
}

export default TabsWeekDays;
