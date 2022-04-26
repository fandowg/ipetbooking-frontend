<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components:{
    Editor: () => lazyLoadComponent(import('@tinymce/tinymce-vue')),
  },
  props: {
    fixedPhrase: {
      type: Array,
      default: () => {
        return []
      },
    },
    content: {
      type: String,
      default: '',
    },
    oneline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      innerText: this.content,
      config: {
        inline: true,
        menubar: false,
        statusbar: false,
        toolbar: false,
        plugins: "paste",
        paste_as_text: true,
        
        gecko_spellcheck : true,
        force_br_newlines : false,
        force_p_newlines : false,
        remove_linebreaks: false,
      },
      
    }
  },
  computed: {
    editor() {
      return this.$refs.tinymce.editor
    },
  },
  created() {
    this.updateInnerText()
  },
  mounted() {
    const _this = this
    this.addLiveListener('click', 'MARK', function (e) {
      this.preventDefault()
      _this.removeElement(e)
    })
  },
  methods: {
    /**
     * 移除元素
     *
     * @param {element} element
     */
    removeElement(element) {
      const parentObj = element.parentNode
      parentObj.removeChild(element)

      // 防止消失的模板出現在樣式預覽上面
      this.editor.selection.select(this.editor.getBody(), true)
      this.editor.selection.collapse(false)
      this.$nextTick(()=>{
        this.emitUpdate()
      })
    },
    /**
     * 新增Live事件
     *
     * @param {string} eventType - click, scroll ...
     * @param {string} tagName - DIV, MARK, SPAN ...
     * @param {function} callback - click, scroll ...
     */
    addLiveListener(eventType, tagName, callback) {
      this.$el.removeEventListener(eventType, handle)
      this.$el.addEventListener(eventType, handle)
      function handle(event) {
        let element = event.target

        if (element && element.tagName === tagName) {
          callback.call(event, element)
        }
      }
    },
    /**
     * 改變文字
     *
     * @param {element} event
     */
    onChangeText(event) {
      if (event.keyCode === 13) {
        event.preventDefault()
      }

      this.emitUpdate()
    },
    updateInnerText() {
      // 判斷是否為舊格式
      if(!this.isHTML(this.innerText))
        this.innerText = this.replaceToMark(this.innerText)
    },
    insertButton(text) {
      this.editor.insertContent(`<mark contenteditable="false">{${text}}</mark>`);
      this.emitUpdate()
    },
    getTemplateContent() {
      let content = this.editor.getContent({ format: "text" })
      content = content.replace(/(\n){3}/g,'<br>')
      content = content.replace(/(\n){2}/g,'<br>')
      content = content.replace(/\<br\>/g,'\n')
      return content
    },
    getTemplateContentHTML() {
      return this.editor.getContent()
    },
    replaceToMark(content) {
      if (content === null) return ''
      this.fixedPhrase.forEach((key) => {
        content = content.replace(
          new RegExp(`{${key}}`, 'g'),
          `<mark contenteditable="false">${key}</mark>`
        )
      })
      content = this.replaceToBreakLine(content)
      return content
    },
    replaceToString(content) {
      if (content === null) return ''
      this.fixedPhrase.forEach((key) => {
        content = content.replace(
          new RegExp(`<mark contenteditable="false">${key}</mark>`, 'g'),
          `{${key}}`
        )
      })
      content = this.replaceBreakLine(content)
      return content
    },
    replaceBreakLine(content) {
      if (content === null) return ''
      content = content.replace(new RegExp(`<div>`, 'g'), `\n`)
      content = content.replace(new RegExp(`<br>`, 'g'), `\n`)
      content = content.replace(new RegExp(`</div>`, 'g'), ``)
      content = content.replace(new RegExp(`&nbsp;`, 'g'), ` `)
      return content
    },
    replaceToBreakLine(content) {
      if (content === null) return ''
      content = content.replace(new RegExp(`\n`, 'g'), `<p></p>`)
      return content
    },
    emitUpdate() {
      this.$emit('update')
      // this.$forceUpdate()
    },
    isHTML(value) {
      if(value){
        return value.includes('<p>')
      } else {
        return false
      }
      
    },
  },
}
</script>
<template>
  <div id="textarea-box">
    <div class="phrase">
      <el-button-group>
        <el-button
          v-for="(text, index) in fixedPhrase"
          :key="index + text"
          type="primary"
          plain
          @click="insertButton(text)"
          ><BaseIcon name="plus" /> {{ text }}</el-button
        >
      </el-button-group>
    </div>
    <Editor v-if="!oneline" ref="tinymce" v-model="innerText" class="el-textarea__inner"  api-key="no-api-key" :init="config" @onKeyUp="onChangeText($event)" />
    <Editor
      v-else
      ref="tinymce"
      v-model="innerText"
      class="el-textarea__inner oneline"
      api-key="no-api-key"
      :init="{ ...config,
        setup: (editor) => {
          editor.on('keydown',(e) => {
            if (e.keyCode === 13)
              e.preventDefault()
          })
	      }, 
        paste_preprocess: (plugin, args) => {
          // 多行改為一行
          args.content = args.content.replace(/\<p\>/g,'')
          args.content = args.content.replace(/\<\/p\>/g,'')
        },
      }"
      @input="onChangeText($event)"
    >
    </Editor>
  </div>
</template>
<style lang="scss">
@import '@design';
mark {
  background: white;
  padding: 0.3rem 0.7rem;
  border-radius: 3px;
  color: $color-primary;
  border: 1px solid $color-primary;
  cursor: pointer;
  margin: 0 0.25rem;
  font-size: 100%;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  br {
    display: none;
  }
  &::after {
    content: '\e79d';
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $color-primary;
    font-size: 14px;
    vertical-align: text-top;
    margin-left: 10px;
  }
}

.phrase {
  .el-button {
    padding: 10px;
    font-size: 12px;
  }
}

div[contenteditable='true'] {
  min-height: 140px;
  line-height: 2.5;
  overflow: hidden;
  resize: none;
  font-size: 12px;
  &.oneline {
    min-height: inherit;
    white-space: nowrap;
  }
}

#textarea-box {
  position: relative;
  .phrase {
    margin: 15px 0;
  }
  :global {
    p {
      margin: 0;
    }
  }
}

.tox-notifications-container {display: none !important;}
</style>
