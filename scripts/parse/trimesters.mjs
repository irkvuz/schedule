import axios from 'axios';

/**
 * Returns array of trimester ids 
 * i.e. [1282, 1286, 1287, 1290, 1291, 1294, 1295]
 * @returns { number[] } 
]]
 */
export async function getCurrentTrimesters() {
  const response = await axios.get('http://bgu.ru/telek/timetable.aspx');
  if (response.status !== 200) throw new Error(response.Error);
  /** @type string */
  const html = response.data;
  const matchAllIterator = html.matchAll(
    /<input type="hidden" name="ctl00\$ContentPlaceHolder1\$HFids.*" id="ContentPlaceHolder1_HFids.*" value="(\d{2,})"/g
  );
  const results = [...matchAllIterator].map((i) => Number(i[1])).sort();
  return results;
}
