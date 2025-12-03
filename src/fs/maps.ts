
export interface CreateMapFileOptions {
  width: number;
  height: number;
  saveStatus: boolean;
}

export interface BatchCreateMapFilesOptions {
  width: number;
  height: number;
  saveStatus: boolean;
  floorTitlesTemplate: string;
  floorNamesTemplate: string;
}

export const createMapFile = async (saveFilename: string, options: CreateMapFileOptions) => {
  //saveAsFilename不含'/'不含'.js'
  const currData = editor.currentFloorData;
  const { width, height, saveStatus } = options;

  let title = saveStatus ? currData.title : "新建楼层";
  let name = saveStatus ? currData.name : "0";
  if (/^mt\d+$/i.test(saveFilename)) {
    name = saveFilename.substring(2);
    title = "主塔 " + name + " 层";
  }

  const row = [], map = [];
  for (let i = 0; i < width; i++) row.push(0);
  for (let i = 0; i < height; i++) map.push(row);
  editor.currentFloorData = Object.assign(JSON.parse(JSON.stringify(editor.file.comment._data.floors_template)), {
    floorId: saveFilename,
    title: title,
    name: name,
    width: width,
    height: height,
    map: map,
  }, saveStatus ? {
    canFlyTo: currData.canFlyTo,
    canFlyFrom: currData.canFlyFrom,
    canUseQuickShop: currData.canUseQuickShop,
    cannotViewMap: currData.cannotViewMap,
    cannotMoveDirectly: currData.cannotMoveDirectly,
    ratio: currData.ratio,
    defaultGround: currData.defaultGround,
    bgm: currData.bgm,
    color: currData.color,
    weather: currData.weather,
  } : {});
  // 继承配置表格新增的基本楼层属性
  if (saveStatus) {
    for (const x in currData) {
      if (editor.currentFloorData[x] == null && (typeof currData[x] == 'number' || typeof currData[x] == 'string')) {
        editor.currentFloorData[x] = currData[x];
      }
    }
  }

  Object.keys(editor.currentFloorData).forEach(function (t) {
    if (editor.currentFloorData[t] == null)
      delete editor.currentFloorData[t];
  })
  editor.currentFloorId = saveFilename;
  
  return new Promise<void>((resolve, reject) => {
    editor.file.saveFloorFile(function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

export const batchCreateMapFiles = async (
  floorIdList: string[], 
  from: number, 
  to: number,
  options: BatchCreateMapFilesOptions
) => {
  const currData = editor.currentFloorData;
  const { width, height, saveStatus, floorTitlesTemplate, floorNamesTemplate } = options;

  const calValue = function (text, i) {
    return text.replace(/\${(.*?)}/g, function (word, value) {
      return eval(value);
    });
  }

  const row = [], map = [];
  for (let i = 0; i < width; i++) row.push(0);
  for (let i = 0; i < height; i++) map.push(row);

  const filenames = floorIdList.map(function (v) { return "project/floors/" + v + ".js"; });
  const datas = [];
  for (let i = from; i <= to; i++) {
    var datastr = ['main.floors.', floorIdList[i - from], '=\n{'];
    var data = Object.assign(JSON.parse(JSON.stringify(editor.file.comment._data.floors_template)), {
      floorId: floorIdList[i - from],
      title: calValue(floorTitlesTemplate, i),
      name: calValue(floorNamesTemplate, i),
      width: width,
      height: height,
      map: map,
    }, saveStatus ? {
      canFlyTo: currData.canFlyTo,
      canFlyFrom: currData.canFlyFrom,
      canUseQuickShop: currData.canUseQuickShop,
      cannotViewMap: currData.cannotViewMap,
      cannotMoveDirectly: currData.cannotMoveDirectly,
      ratio: currData.ratio,
      defaultGround: currData.defaultGround,
      bgm: currData.bgm,
      color: currData.color,
      weather: currData.weather,
    } : {});
    Object.keys(data).forEach(function (t) {
      if (data[t] == null)
        delete data[t];
      else {
        if (t == 'map') {
          datastr = datastr.concat(['\n"', t, '": [\n', editor.file.formatMap(data[t]), '\n],']);
        }
        else {
          datastr = datastr.concat(['\n"', t, '": ', JSON.stringify(data[t], null, 4), ',']);
        }
      }
    });
    datastr = datastr.concat(['\n}']);
    datastr = datastr.join('');
    datas.push(encode(datastr));
  }
  editor.file.alertWhenCompress();
  
  return new Promise<void>((resolve, reject) => {
    fs.writeMultiFiles(filenames, datas, function (err, data) {
      if (err) reject(err);
      else resolve();
    });
  });
}
