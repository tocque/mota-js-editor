/**
 * Serialize Utilities
 *
 * 数据序列化工具函数，用于将数据对象序列化为 JS 文件格式。
 */

/**
 * 将数据序列化为 JS 数据文件格式
 *
 * 生成格式: `var varName = \n{json}`
 * 使用 tab 缩进
 *
 * @param varName - 变量名
 * @param data - 数据对象
 * @returns JS 文件内容字符串
 *
 * @example
 * serializeToJsDataFile('data_xxx', { a: 1, b: 2 })
 * // 返回:
 * // var data_xxx =
 * // {
 * // 	"a": 1,
 * // 	"b": 2
 * // }
 */
export function serializeToJsDataFile(varName: string, data: unknown): string {
  const json = JSON.stringify(data, null, '\t');
  return `var ${varName} =\n${json}`;
}

/**
 * 将数据序列化为 JS 地图文件格式
 *
 * 生成格式: `main.floors.floorId = \n{json}`
 * 使用 tab 缩进
 *
 * @param floorId - 楼层 ID
 * @param data - 楼层数据对象
 * @returns JS 文件内容字符串
 *
 * @example
 * serializeToJsMapFile('MT1', { floorId: 'MT1', title: '主塔1层' })
 * // 返回:
 * // main.floors.MT1 =
 * // {
 * // 	"floorId": "MT1",
 * // 	"title": "主塔1层"
 * // }
 */
export function serializeToJsMapFile(floorId: string, data: unknown): string {
  const json = JSON.stringify(data, null, '\t');
  return `main.floors.${floorId} =\n${json}`;
}

/**
 * 检查并提醒用户关于压缩文件的使用
 *
 * 如果 editor.useCompress 为 true，显示提醒并将其设为 'alerted'
 * 防止重复提醒
 */
export function alertWhenCompress(): void {
  if (editor.useCompress === true) {
    editor.useCompress = 'alerted';
    setTimeout(() => {
      alert(
        '当前游戏使用的是压缩文件,修改完成后请使用启动服务.exe->Js代码压缩工具重新压缩,或者把main.js的useCompress改成false来使用原始文件'
      );
    }, 1000);
  }
}
