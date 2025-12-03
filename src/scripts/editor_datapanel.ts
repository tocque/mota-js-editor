export const editor_datapanel_wrapper = function (editor) {

    // 此文件内的内容仅做了分类, 未仔细整理函数

    ///////////////////////////////////////////////////////////////////////
    //////////////////// 地图编辑 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    editor.uifunctions.newMap_func = function () {

    }


    editor.uifunctions.createNewMaps_func = function () {

    }



    ///////////////////////////////////////////////////////////////////////
    //////////////////// 地图选点 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    // 添加自动事件页，无需双击
    editor.uifunctions.addAutoEvent = function () {
        if (editor_mode.mode != 'loc') return false;
        var newid = '2';
        var ae = editor.currentFloorData.autoEvent[editor_mode.pos.x + ',' + editor_mode.pos.y];
        if (ae != null) {
            var testid;
            for (testid = 2; Object.hasOwnProperty.call(ae, testid); testid++);
            newid = testid + '';
        }
        editor_mode.addAction(['add', "['autoEvent']['" + newid + "']", null]);
        editor_mode.onmode('save');
    }












    ///////////////////////////////////////////////////////////////////////
    //////////////////// 图块属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    editor.uifunctions.newIdIdnum_func = function () {
        
    }

    editor.uifunctions.changeId_func = function () {
        
    }

    editor.uifunctions.copyPasteEnemyItem_func = function () {

    }








    ///////////////////////////////////////////////////////////////////////
    //////////////////// 楼层属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    editor.uifunctions.changeFloorId_func = function () {

        editor.dom.changeFloorId.children[1].onclick = function () {
            var floorId = editor.dom.changeFloorId.children[0].value;
            if (floorId) {
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
                    printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
                    return;
                }
                if (main.floorIds.indexOf(floorId) >= 0) {
                    printe("楼层名 " + floorId + " 已存在！");
                    return;
                }
                var currentFloorId = editor.currentFloorId;
                editor.currentFloorId = floorId;
                editor.currentFloorData.floorId = floorId;
                editor.file.saveFloorFile(function (err) {
                    if (err) {
                        printe(err);
                        throw (err);
                    }
                    core.floorIds[core.floorIds.indexOf(currentFloorId)] = floorId;
                    editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
                        if (objs_.slice(-1)[0] != null) {
                            printe(objs_.slice(-1)[0]);
                            throw (objs_.slice(-1)[0])
                        }
                        alert("修改floorId成功，需要刷新编辑器生效。\n请注意，原始的楼层文件没有删除，请根据需要手动删除。");
                        window.location.reload();
                    });
                });
            } else {
                printe('请输入要修改到的floorId');
            }
        }
    }

    editor.uifunctions.changeFloorSize_func = function () {
        var children = editor.dom.changeFloorSize.children;
        children[4].onclick = function () {
            var width = parseInt(children[0].value);
            var height = parseInt(children[1].value);
            var x = parseInt(children[2].value);
            var y = parseInt(children[3].value);
            if (!(width <= 128 && height <= 128 && x >= 0 && y >= 0)) {
                printe("参数错误！宽高不得大于128，偏移量不得小于0");
                return;
            }
            var currentFloorData = editor.currentFloorData;
            var currWidth = currentFloorData.width;
            var currHeight = currentFloorData.height;
            if (width < currWidth) x = -x;
            if (height < currHeight) y = -y;
            // Step 1:创建一个新的地图
            var newFloorData = core.clone(currentFloorData);
            newFloorData.width = width;
            newFloorData.height = height;

            // Step 2:更新map, bgmap和fgmap
            editor.dom.maps.forEach(function (name) {
                newFloorData[name] = [];
                if (currentFloorData[name] && currentFloorData[name].length > 0) {
                    for (var j = 0; j < height; ++j) {
                        newFloorData[name][j] = [];
                        for (var i = 0; i < width; ++i) {
                            var oi = i - x;
                            var oj = j - y;
                            if (oi >= 0 && oi < currWidth && oj >= 0 && oj < currHeight) {
                                newFloorData[name][j].push(currentFloorData[name][oj][oi]);
                            } else {
                                newFloorData[name][j].push(0);
                            }
                        }
                    }
                }
            });

            // Step 3:更新所有坐标
            ["events", "beforeBattle", "afterBattle", "afterGetItem", "afterOpenDoor", "changeFloor", "autoEvent", "cannotMove"].forEach(function (name) {
                newFloorData[name] = {};
                if (!currentFloorData[name]) return;
                for (var loc in currentFloorData[name]) {
                    var oxy = loc.split(','), ox = parseInt(oxy[0]), oy = parseInt(oxy[1]);
                    var nx = ox + x, ny = oy + y;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        newFloorData[name][nx+","+ny] = core.clone(currentFloorData[name][loc]);
                    }
                }
            });

            // Step 4:上楼点&下楼点
            ["upFloor", "downFloor"].forEach(function (name) {
                if (newFloorData[name] && newFloorData[name].length == 2) {
                    newFloorData[name][0]+=x;
                    newFloorData[name][1]+=y;
                }
            });

            editor.file.saveFloor(newFloorData, function (err) {
                if (err) {
                    printe(err);
                    throw(err)
                }
                ;alert('地图更改大小成功，即将刷新地图...\n请检查所有点的事件是否存在问题。');
                window.location.reload();
            });
        }
    }






    ///////////////////////////////////////////////////////////////////////
    //////////////////// 全塔属性 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 脚本编辑 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 追加素材 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////





    editor.uifunctions.appendPic_func = function () {
        // --- fix ctx
        [editor.dom.appendSourceCtx, editor.dom.appendSpriteCtx].forEach(function (ctx) {
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        })

        // --- selectAppend
        var selectAppend_str = [];
        ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48", "autotile"].forEach(function (image) {
            selectAppend_str.push(["<option value='", image, "'>", image, '</option>\n'].join(''));
        });
        editor.dom.selectAppend.innerHTML = selectAppend_str.join('');
        editor.dom.selectAppend.onchange = function () {

            var value = editor.dom.selectAppend.value;

            if (value == 'autotile') {
                editor_mode.appendPic.imageName = 'autotile';
                for (var jj = 0; jj < 4; jj++) editor.dom.appendPicSelection.children[jj].style = 'display:none';
                if (editor_mode.appendPic.img) {
                    editor.dom.appendSprite.style.width = (editor.dom.appendSprite.width = editor_mode.appendPic.img.width) / editor.uivalues.ratio + 'px';
                    editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = editor_mode.appendPic.img.height) / editor.uivalues.ratio + 'px';
                    editor.dom.appendSpriteCtx.clearRect(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
                    editor.dom.appendSpriteCtx.drawImage(editor_mode.appendPic.img, 0, 0);
                }
                return;
            }

            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            editor_mode.appendPic.imageName = value;
            var img = core.material.images[value];
            editor_mode.appendPic.toImg = img;
            var num = ~~img.width / 32;
            editor_mode.appendPic.num = num;
            editor_mode.appendPic.index = 0;
            var selectStr = '';
            for (var ii = 0; ii < num; ii++) {
                editor.dom.appendPicSelection.children[ii].style = 'left:0;top:0;height:' + (ysize - 6) + 'px';
                selectStr += '{"x":0,"y":0},'
            }
            editor_mode.appendPic.selectPos = eval('[' + selectStr + ']');
            for (var jj = num; jj < 4; jj++) {
                editor.dom.appendPicSelection.children[jj].style = 'display:none';
            }
            editor.dom.appendSprite.style.width = (editor.dom.appendSprite.width = img.width) / editor.uivalues.ratio + 'px';
            editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = img.height + ysize) / editor.uivalues.ratio + 'px';
            editor.dom.appendSpriteCtx.drawImage(img, 0, 0);
        }
        editor.dom.selectAppend.onchange();

        // --- selectFileBtn
        var autoAdjust = function (image, callback) {
            var changed = false;

            // Step 1: 检测白底
            var tempCanvas = document.createElement('canvas').getContext('2d');
            tempCanvas.canvas.width = image.width;
            tempCanvas.canvas.height = image.height;
            tempCanvas.mozImageSmoothingEnabled = false;
            tempCanvas.webkitImageSmoothingEnabled = false;
            tempCanvas.msImageSmoothingEnabled = false;
            tempCanvas.imageSmoothingEnabled = false;
            tempCanvas.drawImage(image, 0, 0);
            var imgData = tempCanvas.getImageData(0, 0, image.width, image.height);
            var trans = 0, white = 0, black = 0;
            for (var i = 0; i < image.width; i++) {
                for (var j = 0; j < image.height; j++) {
                    var pixel = editor.util.getPixel(imgData, i, j);
                    if (pixel[3] == 0) trans++;
                    if (pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255 && pixel[3] == 255) white++;
                    // if (pixel[0]==0 && pixel[1]==0 && pixel[2]==0 && pixel[3]==255) black++;
                }
            }
            if (white > black && white > trans * 10 && confirm("看起来这张图片是以纯白为底色，是否自动调整为透明底色？")) {
                for (var i = 0; i < image.width; i++) {
                    for (var j = 0; j < image.height; j++) {
                        var pixel = editor.util.getPixel(imgData, i, j);
                        if (pixel[0] == 255 && pixel[1] == 255 && pixel[2] == 255 && pixel[3] == 255) {
                            editor.util.setPixel(imgData, i, j, [0, 0, 0, 0]);
                        }
                    }
                }
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
            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            if ((image.width % 32 != 0 || image.height % ysize != 0) && (image.width <= 128 && image.height <= ysize * 4)
                && confirm("目标长宽不符合条件，是否自动进行调整？")) {
                var ncanvas = document.createElement('canvas').getContext('2d');
                ncanvas.canvas.width = 128;
                ncanvas.canvas.height = 4 * ysize;
                ncanvas.mozImageSmoothingEnabled = false;
                ncanvas.webkitImageSmoothingEnabled = false;
                ncanvas.msImageSmoothingEnabled = false;
                ncanvas.imageSmoothingEnabled = false;
                var w = image.width / 4, h = image.height / 4;
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        ncanvas.drawImage(tempCanvas.canvas, i * w, j * h, w, h, i * 32 + (32 - w) / 2, j * ysize + (ysize - h) / 2, w, h);
                    }
                }
                tempCanvas = ncanvas;
                changed = true;
            }

            if (!changed) {
                callback(image);
            }
            else {
                var nimg = new Image();
                nimg.onload = function () {
                    callback(nimg);
                };
                nimg.src = tempCanvas.canvas.toDataURL();
            }
        }

        var loadImage = function (content, callback) {
            if (content instanceof Image || content.getContext != null) {
                callback(content);
                return;
            }
            var image = new Image();
            try {
                image.onload = function () {
                    callback(image);
                }
                image.src = content;
            }
            catch (e) {
                printe(e);
            }
        }

        var afterReadFile = function (content, callback) {
            loadImage(content, function (image) {
                autoAdjust(image, function (image) {
                    editor_mode.appendPic.img = image;
                    editor_mode.appendPic.width = image.width;
                    editor_mode.appendPic.height = image.height;

                    if (editor.dom.selectAppend.value == 'autotile') {
                        for (var ii = 0; ii < 3; ii++) {
                            var newsprite = editor.dom.appendPicCanvas.children[ii];
                            newsprite.style.width = (newsprite.width = image.width) / editor.uivalues.ratio + 'px';
                            newsprite.style.height = (newsprite.height = image.height) / editor.uivalues.ratio + 'px';
                        }
                        editor.dom.appendSpriteCtx.clearRect(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
                        editor.dom.appendSpriteCtx.drawImage(image, 0, 0);
                    }
                    else {
                        var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
                        for (var ii = 0; ii < 3; ii++) {
                            var newsprite = editor.dom.appendPicCanvas.children[ii];
                            newsprite.style.width = (newsprite.width = Math.floor(image.width / 32) * 32) / editor.uivalues.ratio + 'px';
                            newsprite.style.height = (newsprite.height = Math.floor(image.height / ysize) * ysize) / editor.uivalues.ratio + 'px';
                        }
                    }

                    //画灰白相间的格子
                    var bgc = editor.dom.appendBgCtx;
                    var colorA = ["#f8f8f8", "#cccccc"];
                    var colorIndex;
                    var sratio = 4;
                    for (var ii = 0; ii < image.width / 32 * sratio; ii++) {
                        colorIndex = 1 - ii % 2;
                        for (var jj = 0; jj < image.height / 32 * sratio; jj++) {
                            bgc.fillStyle = colorA[colorIndex];
                            colorIndex = 1 - colorIndex;
                            bgc.fillRect(ii * 32 / sratio, jj * 32 / sratio, 32 / sratio, 32 / sratio);
                        }
                    }

                    //把导入的图片画出
                    editor.dom.appendSourceCtx.drawImage(image, 0, 0);
                    editor_mode.appendPic.sourceImageData = editor.dom.appendSourceCtx.getImageData(0, 0, image.width, image.height);

                    //重置临时变量
                    editor.dom.selectAppend.onchange();

                    if (callback) callback();
                });
            });
        }

        editor.dom.selectFileBtn.onclick = function () {
            core.readFile(afterReadFile, null, 'image/*', 'img');
        }

        // --- changeColorInput
        var changeColorInput = document.getElementById('changeColorInput')
        changeColorInput.oninput = function () {
            var delta = (~~changeColorInput.value) * 30;
            var imgData = editor_mode.appendPic.sourceImageData;
            var nimgData = new ImageData(imgData.width, imgData.height);
            // ImageData .data 形如一维数组,依次排着每个点的 R(0~255) G(0~255) B(0~255) A(0~255)
            var convert = function (rgba, delta) {
                var rgbToHsl = editor.util.rgbToHsl
                var hue2rgb = editor.util.hue2rgb
                var hslToRgb = editor.util.hslToRgb
                //
                var hsl = rgbToHsl(rgba)
                hsl[0] = (hsl[0] + delta) % 360
                var nrgb = hslToRgb(hsl)
                nrgb.push(rgba[3])
                return nrgb
            }
            for (var x = 0; x < imgData.width; x++) {
                for (var y = 0; y < imgData.height; y++) {
                    editor.util.setPixel(nimgData, x, y, convert(editor.util.getPixel(imgData, x, y), delta))
                }
            }
            editor.dom.appendSourceCtx.clearRect(0, 0, imgData.width, imgData.height);
            editor.dom.appendSourceCtx.putImageData(nimgData, 0, 0);
        }

        // --- picClick
        var eToLoc = function (e) {
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            var loc = {
                'x': scrollLeft + e.clientX + editor.dom.appendPicCanvas.scrollLeft - editor.dom.left1.offsetLeft - editor.dom.appendPicCanvas.offsetLeft,
                'y': scrollTop + e.clientY + editor.dom.appendPicCanvas.scrollTop - editor.dom.left1.offsetTop - editor.dom.appendPicCanvas.offsetTop,
                'size': 32,
                'ysize': editor.dom.selectAppend.value.endsWith('48') ? 48 : 32
            };
            return loc;
        }//返回可用的组件内坐标

        var locToPos = function (loc) {
            var pos = { 'x': ~~(loc.x / loc.size), 'y': ~~(loc.y / loc.ysize), 'ysize': loc.ysize }
            return pos;
        }

        editor.dom.appendPicClick.onclick = function (e) {
            var loc = eToLoc(e);
            var pos = locToPos(loc);
            //console.log(e,loc,pos);
            var num = editor_mode.appendPic.num;
            var ii = editor_mode.appendPic.index;
            if (ii + 1 >= num) editor_mode.appendPic.index = ii + 1 - num;
            else editor_mode.appendPic.index++;
            editor_mode.appendPic.selectPos[ii] = pos;
            editor.dom.appendPicSelection.children[ii].style = [
                'left:', pos.x * 32, 'px;',
                'top:', pos.y * pos.ysize, 'px;',
                'height:', pos.ysize - 6, 'px;'
            ].join('');
        }

        // appendConfirm
        var appendRegister = document.getElementById('appendRegister');
        var appendConfirm = document.getElementById('appendConfirm');
        appendConfirm.onclick = function () {

            var confirmAutotile = function () {
                var image = editor_mode.appendPic.img;
                if (image.width % 96 != 0 || image.height != 128) {
                    printe("不合法的Autotile图片！");
                    return;
                }
                var imgData = editor.dom.appendSourceCtx.getImageData(0, 0, image.width, image.height);
                editor.dom.appendSpriteCtx.putImageData(imgData, 0, 0);
                var imgbase64 = editor.dom.appendSprite.toDataURL().split(',')[1];

                // Step 1: List文件名
                fs.readdir('./project/autotiles', function (err, data) {
                    if (err) {
                        printe(err);
                        throw (err);
                    }

                    // Step 2: 选择Autotile文件名
                    var filename;
                    for (var i = 1; ; ++i) {
                        filename = 'autotile' + i;
                        if (data.indexOf(filename + ".png") == -1) break;
                    }

                    // Step 3: 写入文件
                    fs.writeFile('./project/autotiles/' + filename + ".png", imgbase64, 'base64', function (err, data) {
                        if (err) {
                            printe(err);
                            throw (err);
                        }
                        // Step 4: 自动注册
                        editor.file.registerAutotile(filename, function (err) {
                            if (err) {
                                printe(err);
                                throw (err);
                            }
                            printe('自动元件' + filename + '注册成功,请F5刷新编辑器');
                        })

                    })

                })

            }

            if (editor.dom.selectAppend.value == 'autotile') {
                confirmAutotile();
                return;
            }

            var ysize = editor.dom.selectAppend.value.endsWith('48') ? 48 : 32;
            for (var ii = 0, v; v = editor_mode.appendPic.selectPos[ii]; ii++) {
                // var imgData = editor.dom.appendSourceCtx.getImageData(v.x * 32, v.y * ysize, 32, ysize);
                // editor.dom.appendSpriteCtx.putImageData(imgData, ii * 32, editor.dom.appendSprite.height - ysize);
                // editor.dom.appendSpriteCtx.drawImage(editor_mode.appendPic.img, v.x * 32, v.y * ysize, 32, ysize,  ii * 32, height,  32, ysize)

                editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, v.x * 32, v.y * ysize, 32, ysize, 32 * ii, editor.dom.appendSprite.height - ysize, 32, ysize);
            }
            var dt = editor.dom.appendSpriteCtx.getImageData(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
            var imgbase64 = editor.dom.appendSprite.toDataURL('image/png');
            var imgName = editor_mode.appendPic.imageName;
            fs.writeFile('./project/materials/' + imgName + '.png', imgbase64.split(',')[1], 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                var currHeight = editor.dom.appendSprite.height;
                editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = (currHeight + ysize)) + "px";
                editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
                core.material.images[imgName].src = imgbase64;
                editor.widthsX[imgName][3] = currHeight;
                if (appendRegister && appendRegister.checked) {
                    editor.file.autoRegister({images: imgName}, function (e) {
                        if (e) {
                            printe(e);
                            throw e;
                        }
                        printf('追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。');
                    });
                } else {
                    printf('追加素材成功！你可以继续追加其他素材，最后再刷新以使用。');
                }
            });
        }

        var quickAppendConfirm = document.getElementById('quickAppendConfirm');
        quickAppendConfirm.onclick = function () {
            var value = editor.dom.selectAppend.value;
            if (value != 'items' && value != 'enemys' && value != 'enemy48' && value != 'npcs' && value != 'npc48')
                return printe("只有怪物或NPC才能快速导入！");
            var ysize = value.endsWith('48') ? 48 : 32;
            var sw = editor.dom.appendSourceCtx.canvas.width, sh = editor.dom.appendSourceCtx.canvas.height;
            if (value == 'items') {
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

            var dt = editor.dom.appendSpriteCtx.getImageData(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
            var appendSize = value == 'items' ? (sw * sh - 1) : 3;
            editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = (editor.dom.appendSprite.height + appendSize * ysize)) + "px";
            editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
            if (editor.dom.appendSprite.width == 32) { // 1帧：道具
                for (var i = 0; i < sw * sh; ++i) {
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 32 * (i % sw), 32 * parseInt(i / sw), 32, 32, 0, editor.dom.appendSprite.height - (sw * sh - i) * ysize, 32, 32);
                }
            } else if (editor.dom.appendSprite.width == 64) { // 两帧
                if (sw == 3) {
                    // 3*4的规格使用13帧
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 0, 0, 32, 4 * ysize, 0, editor.dom.appendSprite.height - 4 * ysize, 32, 4 * ysize);
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 64, 0, 32, 4 * ysize, 32, editor.dom.appendSprite.height - 4 * ysize, 32, 4 * ysize);
                } else {
                    // 4*4的规格使用23帧
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 32, 0, 64, 4 * ysize, 0, editor.dom.appendSprite.height - 4 * ysize, 64, 4 * ysize);
                }             
            } else { // 四帧
                if (sw == 3) {
                    // 3*4的规格使用2123帧
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 32, 0, 32, 4 * ysize, 0, editor.dom.appendSprite.height - 4 * ysize, 32, 4 * ysize);
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 0, 0, 96, 4 * ysize, 32, editor.dom.appendSprite.height - 4 * ysize, 96, 4 * ysize);
                } else {
                    // 4*4的规格使用1234帧
                    editor.dom.appendSpriteCtx.drawImage(editor.dom.appendSourceCtx.canvas, 0, 0, 128, 4 * ysize, 0, editor.dom.appendSprite.height - 4 * ysize, 128, 4 * ysize);
                }
            }

            dt = editor.dom.appendSpriteCtx.getImageData(0, 0, editor.dom.appendSprite.width, editor.dom.appendSprite.height);
            var imgbase64 = editor.dom.appendSprite.toDataURL('image/png');
            var imgName = editor_mode.appendPic.imageName;
            fs.writeFile('./project/materials/' + imgName + '.png', imgbase64.split(',')[1], 'base64', function (err, data) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                var currHeight = editor.dom.appendSprite.height;
                editor.dom.appendSprite.style.height = (editor.dom.appendSprite.height = (currHeight + ysize)) + "px";
                editor.dom.appendSpriteCtx.putImageData(dt, 0, 0);
                core.material.images[imgName].src = imgbase64;
                editor.widthsX[imgName][3] = currHeight;
                if (appendRegister && appendRegister.checked) {
                    editor.file.autoRegister({images: imgName}, function (e) {
                        if (e) {
                            printe(e);
                            throw e;
                        }
                        printf('快速追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。');
                    })
                } else {
                    printf('快速追加素材成功！你可以继续追加其他素材，最后再刷新以使用。');
                }
            });

        }

        editor.uifunctions.dragImageToAppend = function (file, cls) {
            editor.mode.change('appendpic');
            editor.dom.selectAppend.value = cls;
            editor.dom.selectAppend.onchange();

            var reader = new FileReader();
            reader.onload = function () {
                afterReadFile(reader.result, function() {
                    if (cls == 'terrains') return;
                    if (confirm('你确定要快速追加么？')) {
                        if (cls == 'autotile') {
                            appendConfirm.onclick();
                        } else {
                            quickAppendConfirm.onclick();
                        }
                    }
                });
            }
            reader.readAsDataURL(file);
        }

        editor.uifunctions.appendMaterialByInfo = function (info) {
            if (info.isTile) {
                printe('额外素材不支持此功能！');
                return;
            }
            var img = null;
            var cls = info.images;
            var height = cls == 'enemy48' || cls == 'npc48' ? 48 : 32;

            if (cls == 'autotile') {
                img = core.material.images.autotile[info.id];
            } else {
                var image = core.material.images[cls];
                var width = image.width;
                img = document.createElement('canvas');
                img.width = width;
                img.height = height;
                img.getContext('2d').drawImage(image, 0, info.y * height, width, height, 0, 0, width, height);
            }

            editor.mode.change('appendpic');
            editor.dom.selectAppend.value = cls;
            editor.dom.selectAppend.onchange();

            afterReadFile(img, function () {
                changeColorInput.value = 0;
                if (cls == 'autotile') return;

                editor_mode.appendPic.index = 0;
                for (var ii = 0; ii < editor_mode.appendPic.num; ++ii) {
                    editor_mode.appendPic.selectPos[ii] = {x: ii, y: 0, ysize: height};
                    editor.dom.appendPicSelection.children[ii].style = [
                        'left:', ii * 32, 'px;',
                        'top:', 0, 'px;',
                        'height:', height - 6, 'px;'
                    ].join('');
                }
            });
        } 
    }

    ///////////////////////////////////////////////////////////////////////
    //////////////////// 公共事件 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////













    ///////////////////////////////////////////////////////////////////////
    //////////////////// 插件编写 //////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////














}
