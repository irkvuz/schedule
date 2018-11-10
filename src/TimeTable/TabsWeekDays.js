import React from 'react';
import { Tabs, Radio, Table, Icon } from 'antd';
import './TabsWeekDays.css';

const TabPane = Tabs.TabPane;

const wdn = 'воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split(
  '_'
);

const LessonTypes = {
  вне: { name: 'внеучебное занятие', className: 'lek0' },
  л: { name: 'лекция', className: 'lek1' },
  пр: { name: 'практическое занятие', className: 'lek2' },
  лаб: { name: 'лабораторная работа', className: 'lek3' },
  зач: { name: 'зачет', className: 'lek4' },
  экз: { name: 'экзамен', className: 'lek5' },
  конс: { name: 'консультация', className: 'lek6' },
  'п/с': { name: 'пересдача', className: 'lek7' },
  '': { name: 'внеплановое занятие', className: 'lek8' },
  тест: { name: 'тестирование', className: 'lek9' },
  подг: { name: 'подготовительные курсы', className: 'lek10' },
  ол: { name: 'олимпиада', className: 'lek11' },
  конф: { name: 'научная конференция', className: 'lek12' },
  откр: { name: 'день открытых дверей', className: 'lek13' },
};

const columns = [
  {
    key: 'first',
    className: 'StartTime_Room',
    render: (text, record, index) => {
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
    render: (text, record, index) => {
      return (
        <React.Fragment>
          <div>
            <span
              title={LessonTypes[record.LessonType].name}
              className={`LessonType ${
                LessonTypes[record.LessonType].className
              }`}
            >
              {record.LessonType}
            </span>
            &nbsp;
            {record.Lesson}
          </div>
          <div title={record.FIO}>
            <Icon type="user" /> {record.FIOshort}
          </div>
        </React.Fragment>
      );
    },
  },
];

class TabsWeekDays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  render() {
    let weekdays = [];
    for (let i = 1; i <= 6; i++) {
      weekdays[i] = {
        name: wdn[i],
        lessons: [],
      };
    }
    const { schedule } = this.props;
    for (let s of schedule) {
      weekdays[s.WeekDay].lessons.push(s);
    }
    const tabpanes = weekdays.map((wd, i) => {
      if (wd.lessons.length > 0)
        return (
          <TabPane tab={wd.name} key={i}>
            <Table
              dataSource={wd.lessons}
              columns={columns}
              size="small"
              showHeader={false}
              rowKey={r => r.WeekDay + r.StartTime + r.Odd + r.Lesson}
            />
          </TabPane>
        );
    });
    return (
      <div>
        <Radio.Group
          onChange={this.handleModeChange}
          value={this.state.mode}
          style={{ marginBottom: 8 }}
        >
          <Radio.Button value="top">Horizontal</Radio.Button>
          <Radio.Button value="left">Vertical</Radio.Button>
        </Radio.Group>
        <Tabs defaultActiveKey="1" tabPosition={this.state.mode}>
          {tabpanes}
        </Tabs>
      </div>
    );
  }
}

export default TabsWeekDays;
