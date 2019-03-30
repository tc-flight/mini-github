const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')

const timeRange = [
  {label: '今日', value: 'Daily'},
  {label: '本周', value: 'Weekly'},
  {label: '本月', value: 'Monthly'}
]
const languages = [
  { label: '所有语言', value: 'All' },
  ...[
  'C', 'CSS', 'C#', 'C++',
  'Dart', 'Dockerfile',
  'Erlang',
  'Gradle', 'Go',
  'HTML', 'Haskell',
  'Java', 'JavaScript', 'JSON', 'Julia',
  'Kotlin',
  'MATLAB',
  'Python', 'PHP',
  'R', 'Ruby', 'Rust',
  'Shell', 'SQL', 'Swift',
  'TeX',
  'Vue'
].map(it => ({label: it, value: it}))]

let scrollTop = 0
let lastRefresh = moment().unix()

Page({
  data: {
    since: timeRange[0],
    lang: languages[0],
    selectorValues: [timeRange, languages],
    selectedIndices: [0, 0],
    trends: []
  },

  onShow: function () {
    const lastMoment = moment(lastRefresh)
    if (scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },

  onShareAppMessage: function(options) {
  },

  onPullDownRefresh: function () {
    this.reloadData()
  },

  reloadData: function () {
    const [timeIndex, langIndex] = this.data.selectedIndices
    const lang = languages[langIndex] || languages[0]
    const since = timeRange[timeIndex] || timeRange[0]
    this.setData({lang, since})
    github.trendings(since.value.toLowerCase(), lang.value.toLowerCase()).then(data => {
      wx.stopPullDownRefresh()
      this.setData({
        trends: data,
      })
      lastRefresh = moment()
    }).catch(error => wx.stopPullDownRefresh() )
  },

  changeFilter: function (event) {
    const selectedIndices = event.detail.value
    this.setData({ selectedIndices })
    wx.pageScrollTo({
      scrollTop: 0
    })
    wx.startPullDownRefresh({})
  },

  onPageScroll (e) {
    scrollTop = e.scrollTop
  },

  onSearch: function (e) {
    const q = e.detail
    wx.navigateTo({
      url: `/pages/search/search?q=${q}`
    })
  }
})