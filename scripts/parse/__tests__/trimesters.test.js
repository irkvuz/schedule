import { getCurrentTrimesters } from "../trimesters.mjs";

describe('getCurrentTrimesters', () => {
  it('should parse and return ids', async ()=>{
    const trimesters = await getCurrentTrimesters();
    expect(trimesters).toMatchSnapshot();
  });
});
