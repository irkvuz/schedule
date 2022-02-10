import { getTrimesterInfo } from "./getTrimesterInfo";

it('should return correct trimester info', ()=>{
  const trimesters = require('../../public/data/trimesters.json');
  expect(getTrimesterInfo(trimesters[0], new Date('2018-09-08'))).toMatchSnapshot();
});