import { getTrimesterInfo } from "./getTrimesterInfo";


describe('getTrimesterInfo', ()=>{
  const trimesters = require('../../public/data/trimesters.json');
  
  it('should return correct trimester info for the first semester', ()=>{
    expect(getTrimesterInfo(trimesters[0], new Date('2018-09-08'))).toMatchSnapshot();
  });
  
  it('should return correct trimester info for the second semester', ()=>{
    expect(getTrimesterInfo(trimesters[1], new Date('2019-01-18'))).toMatchSnapshot();
  });
})