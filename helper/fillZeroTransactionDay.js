module.exports = {
  fillZeroTransactionDay: (start, end, data, field) => {
    let range;

    start = start.split(" ")[0];
    end = end.split(" ")[0];
    if (start === end) {
      if (data.length === 0) {
        let returndata = { date_column: start };
        returndata[field] = 0;
        return [returndata];
      }
      return data;
    }
    let startmilis = new Date(start).getTime();
    let endmilis = new Date(end).getTime();
    range = (endmilis - startmilis) / (1000 * 60 * 60 * 24);

    let newDataArr = [start];
    for (let i = 1; i <= range; i++) {
      let tomorrow = new Date(start);
      tomorrow.setDate(tomorrow.getDate() + i);
      newDataArr.push(tomorrow.toISOString().split("T")[0]);
    }
    newDataArr = newDataArr.reverse();
    let prevDataIndex = 0;
    newDataArr = newDataArr.map((item) => {
      let singleData = { date_column: item };
      if (item === data[prevDataIndex]?.date_column) {
        singleData[field] = parseInt(data[prevDataIndex][field]);
        prevDataIndex += 1;
        return singleData;
      } else {
        singleData[field] = 0;
        return singleData;
      }
    });
    return newDataArr;
  },
};
