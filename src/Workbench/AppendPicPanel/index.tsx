import { EditorStore, useEditor } from "@/stores/EditorStore";
import type { FC } from "react";
import { TList } from "./constants";
import { useRef, useState } from "react";
import { getPixel, setPixel } from "@/utils/canvas/pixel";
import { detectWhiteBackground } from "@/utils/canvas/detectWhiteBackground";
import { removeWhiteBackground } from "@/utils/canvas/removeWhiteBackground";
import { disableImageSmoothing } from "@/utils/canvas/disableImageSmoothing";

export const AppendPicPanel: FC = () => {
  const { uiRatio } = EditorStore.useStore();
  const [selectAppend, setSelectAppend] = useState<string>("terrains");

  const appendPic = useRef({} as any);

  // --- selectAppend (现在通过 React state 管理)
  const handleSelectAppendChange = (value: string) => {

    if (value == "autotile") {
      appendPic.current.imageName = "autotile";
      for (let jj = 0; jj < 4; jj++) editor.dom.appendPicSelection.children[jj].style = "display:none";
      if (appendPic.current.img) {
        editor.dom.appendSprite.style.width =
          (editor.dom.appendSprite.width = appendPic.current.img.width) / uiRatio + "px";
        editor.dom.appendSprite.style.height =
          (editor.dom.appendSprite.height = appendPic.current.img.height) / uiRatio + "px";
        editor.dom.appendSpriteCtx.clearRect(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
        editor.dom.appendSpriteCtx.drawImage(appendPic.current.img, 0, 0);
      }
      return;
    }

    const ysize = value.endsWith("48") ? 48 : 32;
    appendPic.current.imageName = value;
    const img = core.material.images[value];
    appendPic.current.toImg = img;
    const num = ~~img.width / 32;
    appendPic.current.num = num;
    appendPic.current.index = 0;
    let selectStr = "";
    for (let ii = 0; ii < num; ii++) {
      editor.dom.appendPicSelection.children[ii].style = "left:0;top:0;height:" + (ysize - 6) + "px";
      selectStr += "{\"x\":0,\"y\":0},";
    }
    appendPic.current.selectPos = eval("[" + selectStr + "]");
    for (let jj = num; jj < 4; jj++) {
      editor.dom.appendPicSelection.children[jj].style = "display:none";
    }
    editor.dom.appendSprite.style.width = (editor.dom.appendSprite.width = img.width) / uiRatio + "px";
    editor.dom.appendSprite.style.height =
      (editor.dom.appendSprite.height = img.height + ysize) / uiRatio + "px";
    editor.dom.appendSpriteCtx.drawImage(img, 0, 0);
  };
  
  useEditor(() => {
    // --- fix ctx
    [editor.dom.appendSourceCtx, editor.dom.appendSpriteCtx].forEach((ctx) => {
      disableImageSmoothing(ctx);
    });
    
    // 初始化时调用一次
    handleSelectAppendChange(selectAppend);

    // --- selectFileBtn
    const autoAdjust = function(image, callback) {
      let changed = false;

      // Step 1: 检测白底
      let tempCanvas = document.createElement("canvas").getContext("2d");
      tempCanvas.canvas.width = image.width;
      tempCanvas.canvas.height = image.height;
      disableImageSmoothing(tempCanvas);
      tempCanvas.drawImage(image, 0, 0);
      const imgData = tempCanvas.getImageData(0, 0, image.width, image.height);
      if (detectWhiteBackground(imgData) && confirm("看起来这张图片是以纯白为底色，是否自动调整为透明底色？")) {
        removeWhiteBackground(imgData);
        tempCanvas.clearRect(0, 0, image.width, image.height);
        tempCanvas.putImageData(imgData, 0, 0);
        changed = true;
      }
      /*
            if (black>white && black>trans*10 && confirm("看起来这张图片是以纯黑为底色，是否自动调整为透明底色？")) {
                for (var i=0;i<image.width;i++) {
                    for (var j=0;j<image.height;j++) {
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) {
                            editor.util.setPixel(imgData, i, j, [0,0,0,0]);
                        }
                    }
                }
                tempCanvas.clearRect(0, 0, image.width, image.height);
                tempCanvas.putImageData(imgData, 0, 0);
                changed = true;
            }
            */

      // Step 2: 检测长宽比
      const ysize = selectAppend.endsWith("48") ? 48 : 32;
      if (
        (image.width % 32 != 0 || image.height % ysize != 0) && (image.width <= 128 && image.height <= ysize * 4)
        && confirm("目标长宽不符合条件，是否自动进行调整？")
      ) {
        const ncanvas = document.createElement("canvas").getContext("2d");
        ncanvas.canvas.width = 128;
        ncanvas.canvas.height = 4 * ysize;
        disableImageSmoothing(ncanvas);
        const w = image.width / 4, h = image.height / 4;
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
            ncanvas.drawImage(
              tempCanvas.canvas,
              i * w,
              j * h,
              w,
              h,
              i * 32 + (32 - w) / 2,
              j * ysize + (ysize - h) / 2,
              w,
              h,
            );
          }
        }
        tempCanvas = ncanvas;
        changed = true;
      }

      if (!changed) {
        callback(image);
      } else {
        const nimg = new Image();
        nimg.onload = function() {
          callback(nimg);
        };
        nimg.src = tempCanvas.canvas.toDataURL();
      }
    };

    const loadImage = function(content, callback) {
      if (content instanceof Image || content.getContext != null) {
        callback(content);
        return;
      }
      const image = new Image();
      try {
        image.onload = function() {
          callback(image);
        };
        image.src = content;
      } catch (e) {
        printe(e);
      }
    };

    const afterReadFile = function(content, callback) {
      loadImage(content, (image) => {
        autoAdjust(image, (image) => {
          appendPic.current.img = image;
          appendPic.current.width = image.width;
          appendPic.current.height = image.height;

          if (selectAppend == "autotile") {
            for (var ii = 0; ii < 3; ii++) {
              var newsprite = editor.dom.appendPicCanvas.children[ii];
              newsprite.style.width = (newsprite.width = image.width) / uiRatio + "px";
              newsprite.style.height = (newsprite.height = image.height) / uiRatio + "px";
            }
            editor.dom.appendSpriteCtx.clearRect(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
            editor.dom.appendSpriteCtx.drawImage(image, 0, 0);
          } else {
            const ysize = selectAppend.endsWith("48") ? 48 : 32;
            for (var ii = 0; ii < 3; ii++) {
              var newsprite = editor.dom.appendPicCanvas.children[ii];
              newsprite.style.width = (newsprite.width = Math.floor(image.width / 32) * 32) / uiRatio
                + "px";
              newsprite.style.height =
                (newsprite.height = Math.floor(image.height / ysize) * ysize) / uiRatio + "px";
            }
          }

          // 画灰白相间的格子
          const bgc = editor.dom.appendBgCtx;
          const colorA = ["#f8f8f8", "#cccccc"];
          let colorIndex;
          const sratio = 4;
          for (var ii = 0; ii < image.width / 32 * sratio; ii++) {
            colorIndex = 1 - ii % 2;
            for (let jj = 0; jj < image.height / 32 * sratio; jj++) {
              bgc.fillStyle = colorA[colorIndex];
              colorIndex = 1 - colorIndex;
              bgc.fillRect(ii * 32 / sratio, jj * 32 / sratio, 32 / sratio, 32 / sratio);
            }
          }

          // 把导入的图片画出
          editor.dom.appendSourceCtx.drawImage(image, 0, 0);
          appendPic.current.sourceImageData = editor.dom.appendSourceCtx.getImageData(
            0,
            0,
            image.width,
            image.height,
          );

          // 重置临时变量
          handleSelectAppendChange(selectAppend);

          if (callback) callback();
        });
      });
    };

    // 将 handleFileSelect 暴露给外部使用（通过 selectFileBtn）
    const selectFileBtnElement = document.getElementById("selectFileBtn");
    if (selectFileBtnElement) {
      selectFileBtnElement.onclick = function() {
        core.readFile(afterReadFile, null, "image/*", "img");
      };
    }

    // --- changeColorInput
    const changeColorInput = document.getElementById("changeColorInput");
    changeColorInput.oninput = function() {
      const delta = (~~changeColorInput.value) * 30;
      const imgData = appendPic.current.sourceImageData;
      const nimgData = new ImageData(imgData.width, imgData.height);
      // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
      const convert = function(rgba, delta) {
        const rgbToHsl = editor.util.rgbToHsl;
        const hue2rgb = editor.util.hue2rgb;
        const hslToRgb = editor.util.hslToRgb;
        //
        const hsl = rgbToHsl(rgba);
        hsl[0] = (hsl[0] + delta) % 360;
        const nrgb = hslToRgb(hsl);
        nrgb.push(rgba[3]);
        return nrgb;
      };
      for (let x = 0; x < imgData.width; x++) {
        for (let y = 0; y < imgData.height; y++) {
          setPixel(nimgData, x, y, convert(getPixel(imgData, x, y), delta));
        }
      }
      editor.dom.appendSourceCtx.clearRect(0, 0, imgData.width, imgData.height);
      editor.dom.appendSourceCtx.putImageData(nimgData, 0, 0);
    };

    // --- picClick
    const eToLoc = function(e) {
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const loc = {
        "x": scrollLeft + e.clientX + editor.dom.appendPicCanvas.scrollLeft - editor.dom.left1.offsetLeft
          - editor.dom.appendPicCanvas.offsetLeft,
        "y": scrollTop + e.clientY + editor.dom.appendPicCanvas.scrollTop - editor.dom.left1.offsetTop
          - editor.dom.appendPicCanvas.offsetTop,
        "size": 32,
        "ysize": selectAppend.endsWith("48") ? 48 : 32,
      };
      return loc;
    }; // 返回可用的组件内坐标

    const locToPos = function(loc) {
      const pos = { "x": ~~(loc.x / loc.size), "y": ~~(loc.y / loc.ysize), "ysize": loc.ysize };
      return pos;
    };

    editor.dom.appendPicClick.onclick = function(e) {
      const loc = eToLoc(e);
      const pos = locToPos(loc);
      // console.log(e,loc,pos);
      const num = appendPic.current.num;
      const ii = appendPic.current.index;
      if (ii + 1 >= num) appendPic.current.index = ii + 1 - num;
      else appendPic.current.index++;
      appendPic.current.selectPos[ii] = pos;
      editor.dom.appendPicSelection.children[ii].style = [
        "left:",
        pos.x * 32,
        "px;",
        "top:",
        pos.y * pos.ysize,
        "px;",
        "height:",
        pos.ysize - 6,
        "px;",
      ].join("");
    };

    // appendConfirm
    const appendRegister = document.getElementById("appendRegister");
    const appendConfirm = document.getElementById("appendConfirm");
    appendConfirm.onclick = function() {
      const confirmAutotile = function() {
        const image = appendPic.current.img;
        if (image.width % 96 != 0 || image.height != 128) {
          printe("不合法的Autotile图片！");
          return;
        }
        const imgData = editor.dom.appendSourceCtx.getImageData(0, 0, image.width, image.height);
        editor.dom.appendSpriteCtx.putImageData(imgData, 0, 0);
        const imgbase64 = editor.dom.appendSprite.toDataURL().split(",")[1];

        // Step 1: List文件名
        fs.readdir("./project/autotiles", (err, data) => {
          if (err) {
            printe(err);
            throw err;
          }

          // Step 2: 选择Autotile文件名
          let filename;
          for (let i = 1;; ++i) {
            filename = "autotile" + i;
            if (data.indexOf(filename + ".png") == -1) break;
          }

          // Step 3: 写入文件
          fs.writeFile("./project/autotiles/" + filename + ".png", imgbase64, "base64", (err, data) => {
            if (err) {
              printe(err);
              throw err;
            }
            // Step 4: 自动注册
            editor.file.registerAutotile(filename, (err) => {
              if (err) {
                printe(err);
                throw err;
              }
              printe("自动元件" + filename + "注册成功,请F5刷新编辑器");
            });
          });
        });
      };

      if (selectAppend == "autotile") {
        confirmAutotile();
        return;
      }

      const ysize = selectAppend.endsWith("48") ? 48 : 32;
      for (var ii = 0, v; v = appendPic.current.selectPos[ii]; ii++) {
        // var imgData = editor.dom.appendSourceCtx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
        // editor.dom.appendSpriteCtx.putImageData(imgData, ii * 32, editor.dom.appendSprite.height - ysize);
        // editor.dom.appendSpriteCtx.drawImage(appendPic.current.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)

        editor.dom.appendSpriteCtx.drawImage(
          editor.dom.appendSourceCtx.canvas,
          v.x * 32,
          v.y * ysize,
          32,
          ysize,
          32 * ii,
          editor.dom.appendSprite.height - ysize,
          32,
          ysize,
        );
      }
      const dt = editor.dom.appendSpriteCtx.getImageData(
        0,
        0,
        editor.dom.appendSprite.width,
        editor.dom.appendSprite.height,
      );
      const imgbase64 = editor.dom.appendSprite.toDataURL("image/png");
      const imgName = appendPic.current.imageName;
      fs.writeFile("./project/materials/" + imgName + ".png", imgbase64.split(",")[1], "base64", (err, data) => {
        if (err) {
          printe(err);
          throw err;
        }
        const currHeight = editor.dom.appendSprite.height;
        editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = currHeight + ysize) + "px";
        editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
        core.material.images[imgName].src = imgbase64;
        editor.widthsX[imgName][3] = currHeight;
        if (appendRegister && appendRegister.checked) {
          editor.file.autoRegister({ images: imgName }, (e) => {
            if (e) {
              printe(e);
              throw e;
            }
            printf("追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。");
          });
        } else {
          printf("追加素材成功！你可以继续追加其他素材，最后再刷新以使用。");
        }
      });
    };

    const quickAppendConfirm = document.getElementById("quickAppendConfirm");
    quickAppendConfirm.onclick = function() {
      const value = selectAppend;
      if (value != "items" && value != "enemys" && value != "enemy48" && value != "npcs" && value != "npc48") {
        return printe("只有怪物或NPC才能快速导入！");
      }
      const ysize = value.endsWith("48") ? 48 : 32;
      let sw = editor.dom.appendSourceCtx.canvas.width, sh = editor.dom.appendSourceCtx.canvas.height;
      if (value == "items") {
        if (sw % 32 || sh % 32) {
          return printe("只有长宽都是32的倍数的道具图才可以快速导入！");
        }
      } else {
        if ((sw != 128 && sw != 96) || sh != 4 * ysize) {
          return printe("只有 3*4 或 4*4 的素材图片才可以快速导入！");
        }
      }
      sw = sw / 32;
      sh = sh / ysize;

      let dt = editor.dom.appendSpriteCtx.getImageData(
        0,
        0,
        editor.dom.appendSprite.width,
        editor.dom.appendSprite.height,
      );
      const appendSize = value == "items" ? (sw * sh - 1) : 3;
      editor.dom.appendSprite.style.height =
        (editor.dom.appendSprite.height = editor.dom.appendSprite.height + appendSize * ysize) + "px";
      editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
      if (editor.dom.appendSprite.width == 32) { // 1帧：道具
        for (let i = 0; i < sw * sh; ++i) {
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            32 * (i % sw),
            32 * parseInt(i / sw),
            32,
            32,
            0,
            editor.dom.appendSprite.height - (sw * sh - i) * ysize,
            32,
            32,
          );
        }
      } else if (editor.dom.appendSprite.width == 64) { // 两帧
        if (sw == 3) {
          // 3*4的规格使用13帧
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            0,
            0,
            32,
            4 * ysize,
            0,
            editor.dom.appendSprite.height - 4 * ysize,
            32,
            4 * ysize,
          );
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            64,
            0,
            32,
            4 * ysize,
            32,
            editor.dom.appendSprite.height - 4 * ysize,
            32,
            4 * ysize,
          );
        } else {
          // 4*4的规格使用23帧
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            32,
            0,
            64,
            4 * ysize,
            0,
            editor.dom.appendSprite.height - 4 * ysize,
            64,
            4 * ysize,
          );
        }
      } else { // 四帧
        if (sw == 3) {
          // 3*4的规格使用2123帧
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            32,
            0,
            32,
            4 * ysize,
            0,
            editor.dom.appendSprite.height - 4 * ysize,
            32,
            4 * ysize,
          );
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            0,
            0,
            96,
            4 * ysize,
            32,
            editor.dom.appendSprite.height - 4 * ysize,
            96,
            4 * ysize,
          );
        } else {
          // 4*4的规格使用1234帧
          editor.dom.appendSpriteCtx.drawImage(
            editor.dom.appendSourceCtx.canvas,
            0,
            0,
            128,
            4 * ysize,
            0,
            editor.dom.appendSprite.height - 4 * ysize,
            128,
            4 * ysize,
          );
        }
      }

      dt = editor.dom.appendSpriteCtx.getImageData(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
      const imgbase64 = editor.dom.appendSprite.toDataURL("image/png");
      const imgName = appendPic.current.imageName;
      fs.writeFile("./project/materials/" + imgName + ".png", imgbase64.split(",")[1], "base64", (err, data) => {
        if (err) {
          printe(err);
          throw err;
        }
        const currHeight = editor.dom.appendSprite.height;
        editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = currHeight + ysize) + "px";
        editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
        core.material.images[imgName].src = imgbase64;
        editor.widthsX[imgName][3] = currHeight;
        if (appendRegister && appendRegister.checked) {
          editor.file.autoRegister({ images: imgName }, (e) => {
            if (e) {
              printe(e);
              throw e;
            }
            printf("快速追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。");
          });
        } else {
          printf("快速追加素材成功！你可以继续追加其他素材，最后再刷新以使用。");
        }
      });
    };

    editor.uifunctions.dragImageToAppend = function(file, cls) {
      editor.mode.change("appendpic");
      setSelectAppend(cls);
      handleSelectAppendChange(cls);

      const reader = new FileReader();
      reader.onload = function() {
        afterReadFile(reader.result, () => {
          if (cls == "terrains") return;
          if (confirm("你确定要快速追加么？")) {
            if (cls == "autotile") {
              appendConfirm.onclick();
            } else {
              quickAppendConfirm.onclick();
            }
          }
        });
      };
      reader.readAsDataURL(file);
    };

    editor.uifunctions.appendMaterialByInfo = function(info) {
      if (info.isTile) {
        printe("额外素材不支持此功能！");
        return;
      }
      let img = null;
      const cls = info.images;
      const height = cls == "enemy48" || cls == "npc48" ? 48 : 32;

      if (cls == "autotile") {
        img = core.material.images.autotile[info.id];
      } else {
        const image = core.material.images[cls];
        const width = image.width;
        img = document.createElement("canvas");
        img.width = width;
        img.height = height;
        img.getContext("2d").drawImage(image, 0, info.y * height, width, height, 0, 0, width, height);
      }

      editor.mode.change("appendpic");
      setSelectAppend(cls);
      handleSelectAppendChange(cls);

      afterReadFile(img, () => {
        changeColorInput.value = 0;
        if (cls == "autotile") return;

        appendPic.current.index = 0;
        for (let ii = 0; ii < appendPic.current.num; ++ii) {
          appendPic.current.selectPos[ii] = { x: ii, y: 0, ysize: height };
          editor.dom.appendPicSelection.children[ii].style = [
            "left:",
            ii * 32,
            "px;",
            "top:",
            0,
            "px;",
            "height:",
            height - 6,
            "px;",
          ].join("");
        }
      });
    };
  });

  return (
    <div id="left1" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      {/* appendpic */}
      <h3 className="leftTabHeader">追加素材</h3>
      <div className="leftTabContent">
        <p>
          <input
            id="selectFileBtn"
            type="button"
            value="导入文件到画板"
          />
          <select 
            id="selectAppend" 
            value={selectAppend}
            onChange={(e) => {
              const value = e.target.value;
              setSelectAppend(value);
              handleSelectAppendChange(value);
            }}
          >
            {TList.map((image) => (
              <option key={image} value={image}>
                {image}
              </option>
            ))}
          </select>
          <input id="appendConfirm" type="button" defaultValue="追加" />
          <input
            id="quickAppendConfirm"
            type="button"
            defaultValue="快速追加"
          />
          <span style={{ fontSize: 13 }}>&nbsp;&nbsp;自动注册</span>
          <input id="appendRegister" type="checkbox" defaultChecked />
        </p>
        <p>
          <small>
            从V2.7.1开始，你可以直接将素材图片拖到对应的素材区，将自动追加并注册。同时，4x4的道具素材已支持快速追加一次16个。
          </small>
        </p>
        <p>
          色相:
          <input
            id="changeColorInput"
            type="range"
            min={0}
            max={12}
            step={1}
            defaultValue={0}
            list="huelists"
            style={{ width: "60%", marginLeft: "3%", verticalAlign: "middle" }}
          />
          <datalist id="huelists" style={{ display: "none" }}>
            <option value={0} />
            <option value={1} />
            <option value={2}></option>
            <option value={3} />
            <option value={4} />
            <option value={5}></option>
            <option value={6} />
            <option value={7} />
            <option value={8}></option>
            <option value={9} />
            <option value={10} />
            <option value={11} />
            <option value={12}></option>
          </datalist>
        </p>
        <div
          id="appendPicCanvas"
          style={{ position: "relative", overflow: "auto", height: 470 }}
        >
          <canvas style={{ position: "absolute" }} />
          {/* 用于画出灰白相间背景 */}
          <canvas style={{ position: "absolute" }} />
          {/* 用于画出选中文件 */}
          <canvas style={{ position: "absolute", zIndex: 100 }} />
          {/* 用于响应鼠标点击 */}
          <canvas style={{ position: "absolute", display: "none" }} />
          {/* 画出追加后的sprite用于储存 */}
          <div id="appendPicSelection">
            <div className="appendSelection">
              <span style={{ top: 0, left: 2 }}>1</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 0, left: 14 }}>2</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 12, left: 2 }}>3</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 12, left: 14 }}>4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
