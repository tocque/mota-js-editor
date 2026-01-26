// 使用旧版本 Blockly (3.x) 以保持现有功能
// 新代码应使用 'blockly' (v12)
import * as Blockly from "blockly-legacy";
import * as libraryBlocks from 'blockly-legacy/blocks';
import { javascriptGenerator } from 'blockly-legacy/javascript';
import * as ZhHans from 'blockly-legacy/msg/zh-hans';

window.Blockly = Blockly;

// --- modify Blockly

Blockly.FieldColour.prototype.showEditor_ = function () {
    Blockly.WidgetDiv.hide();

    // console.log('here')
    var self = this;
    var pb = self.sourceBlock_
    var args = MotaActionBlocks[pb.type].args
    var targetf = args[args.indexOf(self.name) - 1]

    var getValue = function () {
        // return self.getValue() // css颜色
        var f = pb.getFieldValue(targetf);
        if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(f)) {
            return f;
        }
        return "";
        // 也可以用 pb.getFieldValue(targetf) 获得颜色块左边的域的内容
    }

    var setValue = function (newValue) { // css颜色
        self.setValue(newValue)
        pb.setFieldValue(newValue.replace("rgba(", "").replace(")", ""), targetf) // 放在颜色块左边的域中
    }

    setTimeout(function () {
        document.getElementById("colorPicker").value = getValue();
        // 设置位置
        var scaledBBox = self.getScaledBBox();
        openColorPicker(scaledBBox.left, scaledBBox.bottom, setValue);
    });

    return document.createElement('table');
};

Blockly.FieldColour.prototype.setValue = function (colour) {
    this.doValueUpdate_(colour);
}

Blockly.FieldColour.prototype.initView = function () {
    this.size_ = new Blockly.utils.Size(
        this.getConstants().FIELD_COLOUR_DEFAULT_WIDTH,
        this.getConstants().FIELD_COLOUR_DEFAULT_HEIGHT);
    if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
        this.createBorderRect_();
        this.borderRect_.style['fillOpacity'] = '1';
        this.borderRect_.classList.add('blocklyColourFieldRect');
    } else {
        this.clickTarget_ = this.sourceBlock_.getSvgRoot();
    }
};

Blockly.FieldTextInput.prototype.showInlineEditor_ = function (quietInput) {
    Blockly.WidgetDiv.show(
        this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
    this.htmlInput_ = this.widgetCreate_();
    this.isBeingEdited_ = true;

    editor_blockly.onTextFieldCreate(this, this.htmlInput_);

    if (!quietInput) {
        this.htmlInput_.focus({ preventScroll: true });
        this.htmlInput_.select();
    }
};

Blockly.FieldTextInput.prototype.onHtmlInputKeyDown_ = function (e) {
    if (e.keyCode == Blockly.utils.KeyCodes.ENTER && !(window.awesomplete && window.awesomplete.opened)) {
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
    } else if (e.keyCode == Blockly.utils.KeyCodes.ESC) {
        this.htmlInput_.value = this.htmlInput_.defaultValue;
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
    } else if (e.keyCode == Blockly.utils.KeyCodes.TAB) {
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideWithoutAnimation();
        this.sourceBlock_.tab(this, !e.shiftKey);
        e.preventDefault();
    }
};

Blockly.FieldMultilineInput.prototype.showInlineEditor_ = function (quietInput) {
    Blockly.FieldMultilineInput.superClass_.showInlineEditor_.call(this, quietInput);
    // force to resize the input
    this.htmlInput_.style.height = Blockly.WidgetDiv.DIV.style.height;
};

Blockly.FieldMultilineInput.prototype.onHtmlInputChange_ = function (e) {
    Blockly.FieldMultilineInput.superClass_.onHtmlInputChange_.call(this, e);
    // force to resize the input
    this.htmlInput_.style.height = Blockly.WidgetDiv.DIV.style.height;
};

Blockly.copy_ = function (toCopy) {
    if (toCopy.isComment) {
        var xml = toCopy.toXmlWithXY();
    } else {
        var xml = Blockly.Xml.blockToDom(toCopy, true);
        // Copy only the selected block and internal blocks.
        Blockly.Xml.deleteNext(xml);
        // Encode start position in XML.
        var xy = toCopy.getRelativeToSurfaceXY();
        xml.setAttribute('x', toCopy.RTL ? -xy.x : xy.x);
        xml.setAttribute('oy', xy.y);
        xml.setAttribute('sy', toCopy.workspace.scrollY);
    }
    Blockly.clipboardXml_ = xml;
    Blockly.clipboardSource_ = toCopy.workspace;
    Blockly.clipboardTypeCounts_ = toCopy.isComment ? null :
        Blockly.utils.getBlockTypeCounts(toCopy, true);
};

/**
 * Paste the provided block onto the workspace.
 * @param {!Element} xmlBlock XML block element.
 */
Blockly.WorkspaceSvg.prototype.paste = function (xmlBlock) {
    if (!this.rendered || xmlBlock.getElementsByTagName('block').length >=
        this.remainingCapacity()) {
        return;
    }
    if (this.currentGesture_) {
        this.currentGesture_.cancel();  // Dragging while pasting?  No.
    }
    if (xmlBlock.tagName.toLowerCase() == 'comment') {
        this.pasteWorkspaceComment_(xmlBlock);
    } else {
        if (xmlBlock.hasAttribute('oy') && xmlBlock.hasAttribute('sy')) {
            xmlBlock.setAttribute('y', parseFloat(xmlBlock.getAttribute('oy')) + parseFloat(xmlBlock.getAttribute('sy')) - this.scrollY);
        }
        this.pasteBlock_(xmlBlock);
    }
};

// -- Support showing disabled blocks

Blockly.Generator.prototype.blockToCode = function (block, opt_thisOnly) {
    if (this.isInitialized === false) {
        console.warn(
            'Generator init was not called before blockToCode was called.');
    }
    if (!block) {
        return '';
    }
    if (!block.isEnabled() && !editor_blockly.isBlockCollapsedSupported(block)) {
        // Skip past this block if it is disabled.
        return opt_thisOnly ? '' : this.blockToCode(block.getNextBlock());
    }
    if (block.isInsertionMarker()) {
        // Skip past insertion markers.
        return opt_thisOnly ? '' : this.blockToCode(block.getChildren(false)[0]);
    }

    var func = this[block.type];
    if (typeof func != 'function') {
        throw Error('Language "' + this.name_ + '" does not know how to generate ' +
            'code for block type "' + block.type + '".');
    }
    // First argument to func.call is the value of 'this' in the generator.
    // Prior to 24 September 2013 'this' was the only way to access the block.
    // The current preferred method of accessing the block is through the second
    // argument to func.call, which becomes the first parameter to the generator.
    var code = func.call(block, block);
    if (Array.isArray(code)) {
        // Value blocks return tuples of code and operator order.
        if (!block.outputConnection) {
            throw TypeError('Expecting string from statement block: ' + block.type);
        }
        return [this.scrub_(block, code[0], opt_thisOnly), code[1]];
    } else if (typeof code == 'string') {
        if (this.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
            code = this.injectId(this.STATEMENT_PREFIX, block) + code;
        }
        if (this.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
            code = code + this.injectId(this.STATEMENT_SUFFIX, block);
        }
        return this.scrub_(block, code, opt_thisOnly);
    } else if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    throw SyntaxError('Invalid code generated: ' + code);
};

Blockly.BlockSvg.prototype.generateContextMenu = function () {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return null;
    }
    // Save the current block in a variable for use in closures.
    var block = this;
    var menuOptions = [];

    if (!this.isInFlyout) {
        // 删除
        if (this.isDeletable() && this.isMovable()) {
            menuOptions.push(Blockly.ContextMenu.blockDuplicateOption(block));
        }

        if (editor_blockly.isBlockCollapsedSupported(this)) {
            menuOptions.push({
                text: this.isCollapsed() ? Blockly.Msg['EXPAND_BLOCK'] : Blockly.Msg['COLLAPSE_BLOCK'],
                enabled: true,
                callback: function () { block.setCollapsed(!block.collapsed_); }
            });

            menuOptions.push({
                text: this.isEnabled() ? Blockly.Msg['DISABLE_BLOCK'] : Blockly.Msg['ENABLE_BLOCK'],
                enabled: !this.getInheritedDisabled(),
                callback: function () {
                    var group = Blockly.Events.getGroup();
                    if (!group) {
                        Blockly.Events.setGroup(true);
                    }
                    block.setEnabled(!block.isEnabled());
                    if (!group) {
                        Blockly.Events.setGroup(false);
                    }
                }
            });
        }
        if (this.isDeletable()) {
            menuOptions.push(Blockly.ContextMenu.blockDeleteOption(block));
        }
    }

    menuOptions.push(Blockly.ContextMenu.blockHelpOption(block));
    if (this.customContextMenu) this.customContextMenu(menuOptions);
    return menuOptions;
};

Blockly.FieldDropdown.prototype.doClassValidation_ = function (opt_newValue) {
    return opt_newValue;
}

Blockly.FieldDropdown.prototype.doValueUpdate_ = function (newValue) {
    Blockly.FieldDropdown.superClass_.doValueUpdate_.call(this, newValue);
    var options = this.getOptions(true);
    for (var i = 0, option; (option = options[i]); i++) {
        if (option[1] == this.value_) {
            this.selectedOption_ = option;
        }
    }
    if (this.selectedOption_[1] != this.value_) {
        options.push([this.value_, this.value_]);
        this.selectedOption_ = options[options.length - 1];
    }
};

Blockly.FieldMultilineInput.prototype.getDisplayText_ = function () {
    var value = this.value_;
    if (!value) return Blockly.Field.NBSP;
    var curr = '', text = '';
    for (var i = 0; i < value.length; ++i) {
        if (value[i] == '\n' || curr.length == this.maxDisplayLength) {
            text += curr.replace(/\s/g, Blockly.Field.NBSP) + '\n';
            curr = value[i] == '\n' ? '' : value[i];
        } else curr += value[i];
    }
    return text + curr;
};