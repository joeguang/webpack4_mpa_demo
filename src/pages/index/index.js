import './index.scss'
import '../../assets/css/common.css'

// 最低抽奖人数
const num = 3

// 定时器初始值0 之后递增
let _rTimer = 0
let second = 0

var app = new Vue({
  el: '#app',
  data: {
    arr: [{
      name: 'Joe',
      selectCount: 0
    }, {
      name: 'Mike',
      selectCount: 0
    }, {
      name: 'MIMI',
      selectCount: 0,
    }, {
      name: 'Lucy',
      selectCount: 0
    }, {
      name: '张三',
      selectCount: 0
    }, {
      name: '李四',
      selectCount: 0
    }, {
      name: '王五',
      selectCount: 0
    }],
    form: {
      name: ''
    },
    showModal: false,
    selectName: '嘿嘿',
    // 中了三次奖的次数
    gotGoldNum: 0,
    isCanClick: true,
    // 蒙层显示
    isShowMask: false
  },
  mounted () {
  },
  methods: {
    confirmAdd () {
      if (!this.form.name) {
        this.$message({
          message: '请输入姓名',
          center: true
        })
        return
      }
      var curName = this.arr.find(item => {
        return item === this.form.name
      })
      if (curName) {
        this.$message({
          message: '已存在',
          center: true
        })
        return
      }
      this.arr.push({
        name: this.form.name,
        selectCount: 0
      })
      this.showModal = false
    },
    handleSelect () {
      console.log('this.isCanClick', this.isCanClick)
      if (!this.isCanClick) {
        console.log('已经在抽奖了,请勿重新点击')
        return
      }
      this.isCanClick = false
      if (this.arr.length < 3) {
        this.$message({
          message: '抽奖人数太少，去添加吧',
          center: true
        })
        return
      }
      if (this.gotGoldNum >= 3) {
        this.$alert('已经有三个人中了三次奖了，咱重开吧，行不？？？', '温馨提示', {
          confirmButtonText: '好的',
          callback: () => {
            // 清零
            this.gotGoldNum = 0
            this.arr.map(item => {
              item.selectCount = 0
            })
            // 打乱数组
            this.arr.sort(function () { return 0.5 - Math.random() })
            this.isCanClick = true
            this.handleSelect()
          }
        });
        return
      }

      // 重置数据
      _rTimer = 0
      second = 0

      var timer = setInterval(() => {
        let _curPerson = this.arr[Math.floor(Math.random() * this.arr.length)]
        this.selectName = _curPerson.name
      })

      var _timer = setInterval(() => {
        clearInterval(timer)
        _rTimer += 60
        console.log('_rTimer', _rTimer)
        timer = setInterval(() => {
          let _curPerson = this.arr[Math.floor(Math.random() * this.arr.length)]
          this.selectName = _curPerson.name
        }, _rTimer)
        second += 1
        console.log('second', second)
        if (second == 3) {
          clearInterval(_timer)
          clearInterval(timer)
          this.computedSelectName()
          this.isCanClick = true
          //展示蒙层
          this.isShowMask = true
          // 创建动画
          window.requestAnimationFrame(this.createAnimate)
        }
      }, 1000)

    },
    computedSelectName () {
      let _curPerson = this.arr.find(item => {
        return this.selectName === item.name
      })
      // 取随机数
      _curPerson.selectCount += 1
      // 打印数据
      console.clear()
      this.arr.map(item => {
        console.log(`名字%c${item.name}%c被抽中次数${item.selectCount}`, 'color: blue', 'color: red')
      })
      if (_curPerson.selectCount >= 3) {
        this.$alert(`${_curPerson.name}您已经中了三次了!!!Get Out Here!!!`, '温馨提示', {
          confirmButtonText: '确定',
          callback: () => {
            for (let i = 0; i < this.arr.length; i++) {
              if (this.arr[i].name === _curPerson.name) {
                // 删除幸运儿
                this.arr.splice(i, 1)
                break
              }
            }
            // 中奖三次以后
            this.gotGoldNum += 1
          }
        });
      }
    },

    resetMask () {
      const topLeft = document.querySelector('.top-left')
      const topRight = document.querySelector('.top-right')
      const bottomRight = document.querySelector('.bottom-right')
      const bottomLeft = document.querySelector('.bottom-left')
      topLeft.style.left = '0'
      topLeft.style.top = '0'

      topRight.style.right = '0'
      topRight.style.top = '0'

      bottomRight.style.bottom = '0'
      bottomRight.style.right = '0'

      bottomLeft.style.bottom = '0'
      bottomLeft.style.left = '0'

      this.isShowMask = false

    },

    createAnimate() {
      const topLeft = document.querySelector('.top-left')
      const topRight = document.querySelector('.top-right')
      const bottomRight = document.querySelector('.bottom-right')
      const bottomLeft = document.querySelector('.bottom-left')

      topLeft.style.left = '50%'
      topLeft.style.top = '50%'
      topLeft.style.transform = 'translate(-50%, -50%) rotate(360deg) scale(4.8)'
      topLeft.style.transition = 'all 5s'

      topRight.style.right = '50%'
      topRight.style.top = '50%'
      topRight.style.transform = 'translate(50%, -50%) rotate(360deg) scale(4.8)'
      topRight.style.transition = 'all 5s'
      
      bottomRight.style.bottom = '50%'
      bottomRight.style.right = '50%'
      bottomRight.style.transform = 'translate(50%, 50%) rotate(360deg) scale(4.8)'
      bottomRight.style.transition = 'all 5s'
      
      bottomLeft.style.bottom = '50%'
      bottomLeft.style.left = '50%'
      bottomLeft.style.transform = 'translate(-50%, 50%) rotate(360deg) scale(4.8)'
      bottomLeft.style.transition = 'all 5s'
    }
  }
})
