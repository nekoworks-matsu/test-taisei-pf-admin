import { Router } from 'express'
import bodyParser from 'body-parser'
import PDFDocument from 'pdfkit'
import dateFormat from 'dateformat'
import cookieParser from 'cookie-parser'
import request from 'superagent'
import moment from 'moment'
import imageSize from 'image-size'

const environment = process.env.NODE_ENV || 'development'
const env = require(`../env/${environment}.env.js`)

const router = Router()
const axios = require('axios')
const imageDrawSize = 150
const imageSpaceWidth = 10
const pdfLeftMargin = 20
const dateLabelWidth = 95
const timaAndStaffWidth = 75
const numberLabelWidth = 20
// const imageSize = require('image-size')

router.use(bodyParser.json({ limit: '1000mb' }))
router.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }))
router.use(
  bodyParser.urlencoded({
    extended: true
  })
)
router.use(cookieParser())

var list = []
var floorDatas = []
var countList = []
var imageList = []
var topicList = []
var otherList = []
var scheduleList = []
var chartList = []
var base64Images = []
var report_title = ''
var buildingName = ''
var report_header = {}
var imageHeaderUrl = env.RESOURCE_SERVER
var http = require('http')
var fs = require('fs')
var categoryList = []
var buildingOwner = ''
var approver = ''
var status = ''
var sortSettings = []
var builFloors = []
var allMembers = []
var reportSections = []

router.post('/pdf', (req, res) => {
  list = []
  floorDatas = []
  report_header = {}
  report_title = ' '

  try {
    var report_id = req.body.report_id
    var rerport_day = req.body.date
    report_title = req.body.report_title
    buildingName = req.body.buildingName
    rerport_day = rerport_day.replace(/\//g, '-')
    categoryList = JSON.parse(req.body.list)
    buildingOwner = req.body.buildingOwner
    approver = req.body.approver
    status = req.body.status
    sortSettings = JSON.parse(req.body.sortSettings)

    if (buildingOwner == null) {
      buildingOwner = ' '
    } else if (buildingOwner == '') {
      buildingOwner = ' '
    }

    const url = env.API_SERVER + '/reports/' + report_id
    if (req.body.isApproval == 'true') {
      allMembers = JSON.parse(req.body.allMembers)
      reportSections = JSON.parse(req.body.reportSections)
      builFloors = JSON.parse(req.body.floors)
      // parseReportSection();
      request
        .get(url)
        .set('Authorization', 'Bearer ' + req.body.token)
        .send()
        .end((err, res_1) => {
          generateApprovalPDF(res, req)
        })
    } else {
      getReportInfoRequest(url, res, req)
    }
  } catch (e) {
    res.redirect('/login')
    console.log(e)
  }
})

router.post('/monthly_report_pdf', (req, res) => {
  list = []
  imageList = []
  topicList = []
  chartList = []
  scheduleList = []
  otherList = []
  base64Images = []

  report_header = {}
  report_title = ' '

  try {
    base64Images = JSON.parse(req.body.images)
    report_title = req.body.report_title
    if (req.body.topics != null) {
      topicList = JSON.parse(req.body.topics)
    }

    if (req.body.charts != null) {
      chartList = JSON.parse(req.body.charts)
    }

    if (req.body.schedules != null) {
      scheduleList = JSON.parse(req.body.schedules)
    }

    if (req.body.others != null) {
      otherList = JSON.parse(req.body.others)
    }
    buildingName = req.body.buildingName

    const imageDownload = async () => {
      await beforeOtherImageDownload()
      out_monthly_report_pdf(req, res)
    }

    imageDownload()
  } catch (e) {
    res.redirect('/login')
    console.log(e)
  }
})
function generateApprovalPDF(res, req) {
  report_header = JSON.parse(req.body.header)
  getApprovalAttendances(
    JSON.parse(req.body.approveAttendance),
    req.body.label_switch
  )
  getReportSections(
    JSON.parse(req.body.approveReportSections),
    req,
    req.body.label_switch
  )
  sortSettings.forEach((val) =>
    isApproveFloorSort(val.id, val.fieldId, val.isAsc)
  )
  const imageDownload = async () => {
    await beforeDownload()
    out_pdf(res, req.body.date.replace(/\//g, ''))
    list = []
    report_header = {}
    imageList = []
    countList = []
    floorDatas = []
  }

  imageDownload()
}

function getReportInfoRequest(url, res, req) {
  request
    .get(url)
    .set('Authorization', 'Bearer ' + req.body.token)
    .send()
    .end((err, res_1) => {
      if (res_1 && res_1.ok) {
        report_header = res_1.body.report

        const url_2 =
          env.API_SERVER +
          '/reports/preview?operationCategoryId=' +
          req.body.operationReportTemplateId +
          '&buildingId=' +
          req.body.buildingId +
          '&date=' +
          req.body.date
        request
          .get(url_2)
          .set('Authorization', 'Bearer ' + req.body.token)
          .send()
          .end((err_2, res_2) => {
            if (res_2 && res_2.ok) {
              getAttendances(res_2.body.attendances, req.body.label_switch)
              getReportSections(
                res_2.body.reportSections,
                req,
                req.body.label_switch
              )
              sortSettings.forEach((val) =>
                isFloorSort(val.id, val.fieldId, val.isAsc)
              )
              const imageDownload = async () => {
                await beforeDownload()
                out_pdf(res, req.body.date.replace(/\//g, ''))
                list = []
                report_header = {}
                imageList = []
                countList = []
                floorDatas = []
              }

              imageDownload()
            } else {
              console.log('Error pdf1')
              console.log(err_2.body)
              res.redirect('/login')
            }
          })
      } else {
        console.log('Error pdf2')
        console.log(err)
        res.redirect('/login')
      }
    })
}
function out_monthly_report_pdf(req, res) {
  var operationName = req.body.operationName
  var reportDate1 = dfJapanString(req.body.reportDate, 'yyyymm')
  var reportDate2 = dfJapanString(req.body.reportDate, 'yyyy年m月')
  var filename =
    buildingName + '_' + operationName + '月次報告書_' + reportDate1
  var reportTitle =
    buildingName + ' ' + reportDate2 + operationName + '月次報告書'
  filename = encodeURIComponent(filename) + '.pdf'
  res.setHeader(
    'Content-disposition',
    'attachment; filename="' + filename + '"'
  )
  res.setHeader('Content-type', 'application/pdf; charset=utf-8')
  res.setHeader('Cache-Control', 'must-revalidate;')
  res.setHeader('Pragma', 'must-revalidate;')
  var pageNumber = 1
  const doc = new PDFDocument({
    compress: false,
    size: [595.28, 841.89],
    margins: { top: 30, bottom: 30, left: 50, right: 50 }
  })

  const writePageNumber = () => {
    doc.fontSize(10).text(pageNumber, 570, 825, {
      width: 20,
      height: 10,
      align: 'right',
      lineBreak: false
    })
    pageNumber = pageNumber + 1
  }

  const lineTo = 575
  doc.lineWidth(0)
  doc.font('./static/fonts/meiryo.ttf')

  doc.info.Title = report_title
  doc.info.Author = 'Taisei'
  doc.info.Keywords = report_title
  doc.info.ModDate = new Date()
  doc.pipe(res)

  var dt = new Date(Date.now())
  doc.fontSize(16).text(reportTitle, pdfLeftMargin, 28)
  const headerYposition = doc.y
  doc.fontSize(8).text('大成株式会社', 375, 15, { width: 200, align: 'right' })
  doc
    .fontSize(8)
    .text('出力日:' + df2(dt), pdfLeftMargin, 15, { width: 200, align: 'left' })
  doc.moveDown()

  //ヘッダー
  const headerY = doc.y + 20
  doc
    .moveTo(pdfLeftMargin, headerY)
    .lineTo(lineTo, headerY)
    .stroke()
  var temp_y = doc.y + 20
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('報告年月', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(req.body.reportDate, 210, temp_y, { width: 620, align: 'left' })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('コメント', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  var comment = ' '
  if (req.body.comment != null) {
    comment = req.body.comment + comment
  }
  doc
    .fontSize(8)
    .text(replaceSpace(comment), 210, temp_y, { width: 620, align: 'left' })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()

  doc
    .moveTo(pdfLeftMargin, headerY)
    .lineTo(pdfLeftMargin, doc.y)
    .stroke()
  doc
    .moveTo(205, headerY)
    .lineTo(205, doc.y)
    .stroke()
  doc
    .moveTo(lineTo, headerY)
    .lineTo(lineTo, doc.y)
    .stroke()
  doc.moveDown()

  const IMAGE_MARGIN = 70
  const IMAGE_WIDTH = 455
  doc.x = pdfLeftMargin

  //特記事項
  doc.fontSize(15).text('特記事項', pdfLeftMargin, doc.y)
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()
  const strMargin = 1.5
  if (topicList.length == 0) {
    doc.y += 5
    doc.fontSize(8).text('特記事項の情報はありません', pdfLeftMargin, doc.y)
  } else {
    doc.y += 10
    doc.lineWidth(0)
    doc
      .moveTo(pdfLeftMargin, doc.y)
      .lineTo(lineTo, doc.y)
      .stroke()

    var col_x = pdfLeftMargin

    var columnWidth = 20
    var col_y = doc.y
    const topicY = doc.y
    doc.fontSize(8)
    doc.font('./static/fonts/meiryo-bold.ttf')
    doc.text('日', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'center'
    }) //NOTE:カラム名
    col_x += columnWidth + 5

    doc.text('曜日', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'left'
    }) //NOTE:カラム名
    col_x += columnWidth

    columnWidth = 510
    doc.text('特記事項', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'center'
    }) //NOTE:カラム名
    doc.font('./static/fonts/meiryo.ttf')
    doc
      .moveTo(pdfLeftMargin, doc.y)
      .lineTo(lineTo, doc.y)
      .stroke()

    for (var i = 0; i < topicList.length; i++) {
      col_y = doc.y
      col_x = pdfLeftMargin
      columnWidth = 20

      var topic = topicList[i]
      if (topic.day != null && topic.day != '') {
        var topicDate = new Date(topic.day)
        doc.text(topicDate.getDate(), col_x + strMargin, col_y, {
          width: columnWidth,
          align: 'center'
        })
        col_x += columnWidth + 5

        doc.text(topic.weekday, col_x + strMargin, col_y, {
          width: columnWidth - 3,
          align: 'center'
        })
        col_x += columnWidth
        columnWidth = 510

        doc.text(replaceSpace(topic.text), col_x + strMargin * 3, col_y, {
          width: columnWidth,
          align: 'left'
        })
        doc
          .moveTo(pdfLeftMargin, doc.y)
          .lineTo(lineTo, doc.y)
          .stroke()
      }
    }
    doc
      .moveTo(pdfLeftMargin, topicY)
      .lineTo(pdfLeftMargin, doc.y)
      .stroke()
    doc
      .moveTo(pdfLeftMargin + 24, topicY)
      .lineTo(pdfLeftMargin + 24, doc.y)
      .stroke()
    doc
      .moveTo(pdfLeftMargin + 45, topicY)
      .lineTo(pdfLeftMargin + 45, doc.y)
      .stroke()
    doc
      .moveTo(lineTo, topicY)
      .lineTo(lineTo, doc.y)
      .stroke()
    doc.moveDown()
  }

  columnWidth = 510
  doc.moveDown()
  //グラフ
  doc.fontSize(15).text('日次グラフ', pdfLeftMargin, doc.y)
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()
  doc.y += 5
  for (var i = 0; i < chartList.length; i++) {
    var chart = chartList[i]
    if (chart.appear) {
      console.log('現在:' + i)
      if (doc.y >= 580) {
        // NOTE:改ページ判定
        writePageNumber()
        doc.addPage()
        doc.y = 30
      }
      if (chart.header != null) {
        doc.fontSize(12).text(chart.header, pdfLeftMargin, doc.y, {
          width: columnWidth,
          align: 'left'
        })
      }
      doc.fontSize(10).text(chart.label, pdfLeftMargin * 2, doc.y, {
        width: columnWidth,
        align: 'left'
      })

      doc.x = IMAGE_MARGIN
      var base64Image = base64Images[i]
      if (base64Image != null) {
        console.log('画像あり:' + i)
        doc.image(base64Image, doc.x, doc.y, { width: IMAGE_WIDTH })
      }

      doc.y += 3

      if (chart.note != null) {
        if (doc.y >= 800) {
          // NOTE:改ページ判定
          writePageNumber()
          doc.addPage()
          doc.y = 30
        }
        doc.lineWidth(0)
        doc
          .moveTo(pdfLeftMargin, doc.y)
          .lineTo(lineTo, doc.y)
          .stroke()
        // doc.moveTo(pdfLeftMargin*6+3, doc.y).lineTo(547, doc.y).stroke();
        const noteY = doc.y
        doc
          .fontSize(8)
          .text(
            replaceSpace(chart.note),
            pdfLeftMargin + strMargin * 3,
            noteY,
            { width: 530, align: 'left' }
          )
        doc
          .moveTo(pdfLeftMargin, noteY)
          .lineTo(pdfLeftMargin, doc.y)
          .stroke()
        doc
          .moveTo(lineTo, noteY)
          .lineTo(lineTo, doc.y)
          .stroke()
        doc
          .moveTo(pdfLeftMargin, doc.y)
          .lineTo(lineTo, doc.y)
          .stroke()
        // doc.moveTo(pdfLeftMargin*6+3, doc.y).lineTo(547, doc.y).stroke();
      }
      doc.moveDown()
    }
  }
  doc.moveDown()

  //今後のイベント
  doc.fontSize(15).text('今後のイベント', pdfLeftMargin, doc.y)
  doc.lineWidth(0)
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()
  if (scheduleList.length == 0) {
    doc.y += 5
    doc
      .fontSize(8)
      .text('今後のイベントの情報はありません', pdfLeftMargin, doc.y)
  } else {
    doc.y += 10
    doc.lineWidth(0)
    doc
      .moveTo(pdfLeftMargin, doc.y)
      .lineTo(lineTo, doc.y)
      .stroke()

    var col_x = pdfLeftMargin
    const strMargin = 1.5
    var columnWidth = 20
    var col_y = doc.y
    var topicY = doc.y
    doc.fontSize(8)
    doc.font('./static/fonts/meiryo-bold.ttf')
    doc.text('日', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'center'
    }) //NOTE:カラム名
    col_x += columnWidth + 5

    doc.text('曜日', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'left'
    }) //NOTE:カラム名
    col_x += columnWidth

    columnWidth = 510
    doc.text('イベント', col_x + strMargin, col_y, {
      width: columnWidth,
      align: 'center'
    }) //NOTE:カラム名
    doc.font('./static/fonts/meiryo.ttf')
    doc
      .moveTo(pdfLeftMargin, doc.y)
      .lineTo(lineTo, doc.y)
      .stroke()

    for (var i = 0; i < scheduleList.length; i++) {
      if (doc.y >= 800) {
        // NOTE:改ページ判定
        doc
          .moveTo(pdfLeftMargin, topicY)
          .lineTo(pdfLeftMargin, doc.y)
          .stroke()
        doc
          .moveTo(pdfLeftMargin + 24, topicY)
          .lineTo(pdfLeftMargin + 24, doc.y)
          .stroke()
        doc
          .moveTo(pdfLeftMargin + 45, topicY)
          .lineTo(pdfLeftMargin + 45, doc.y)
          .stroke()
        doc
          .moveTo(lineTo, topicY)
          .lineTo(lineTo, doc.y)
          .stroke()
        writePageNumber()
        doc.addPage()
        doc.fontSize(8)
        doc.lineWidth(0)
        doc.y = 30
        topicY = doc.y
        doc
          .moveTo(pdfLeftMargin, doc.y)
          .lineTo(lineTo, doc.y)
          .stroke()
      }
      col_y = doc.y
      col_x = pdfLeftMargin
      columnWidth = 20

      var schedule = scheduleList[i]
      if (schedule.day != null && schedule.day != '') {
        var topicDate = new Date(schedule.day)
        doc.text(topicDate.getDate(), col_x + strMargin, col_y, {
          width: columnWidth,
          align: 'center'
        })
        col_x += columnWidth + 5

        doc.text(schedule.weekday, col_x + strMargin, col_y, {
          width: columnWidth - 3,
          align: 'center'
        })
        col_x += columnWidth
        columnWidth = 510

        doc.text(schedule.text, col_x + strMargin * 3, col_y, {
          width: columnWidth,
          align: 'left'
        })
        doc
          .moveTo(pdfLeftMargin, doc.y)
          .lineTo(lineTo, doc.y)
          .stroke()
      }
    }
    doc
      .moveTo(pdfLeftMargin, topicY)
      .lineTo(pdfLeftMargin, doc.y)
      .stroke()
    doc
      .moveTo(pdfLeftMargin + 24, topicY)
      .lineTo(pdfLeftMargin + 24, doc.y)
      .stroke()
    doc
      .moveTo(pdfLeftMargin + 45, topicY)
      .lineTo(pdfLeftMargin + 45, doc.y)
      .stroke()
    doc
      .moveTo(lineTo, topicY)
      .lineTo(lineTo, doc.y)
      .stroke()
    doc.moveDown()
  }
  columnWidth = 510

  doc.moveDown()
  //その他
  if (doc.y >= 670) {
    // NOTE:改ページ判定
    writePageNumber()
    doc.addPage()
    doc.y = 30
  }
  doc.lineWidth(0)
  doc.fontSize(15).text('その他', pdfLeftMargin, doc.y)
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(lineTo, doc.y)
    .stroke()

  if (otherList.length == 0) {
    doc.y += 5
    doc.fontSize(8).text('その他の情報はありません', pdfLeftMargin, doc.y)
  }
  var imageIndex = 0
  for (var i = 0; i < otherList.length; i++) {
    if (doc.y >= 670) {
      // NOTE:改ページ判定
      writePageNumber()
      doc.addPage()
      doc.y = 30
    }
    doc.y += 10
    var other = otherList[i]
    doc.fontSize(12).text(other.title, pdfLeftMargin, doc.y, {
      width: columnWidth,
      align: 'left'
    })
    const otherHeaderY = doc.y
    doc.lineWidth(0)
    if (other.body != null) {
      doc
        .moveTo(pdfLeftMargin, doc.y)
        .lineTo(lineTo, doc.y)
        .stroke()
      doc
        .fontSize(8)
        .text(replaceSpace(other.body), pdfLeftMargin + strMargin * 3, doc.y, {
          width: columnWidth - pdfLeftMargin,
          align: 'left'
        })
      doc
        .moveTo(pdfLeftMargin, doc.y)
        .lineTo(lineTo, doc.y)
        .stroke()
      doc
        .moveTo(pdfLeftMargin, doc.y)
        .lineTo(pdfLeftMargin, otherHeaderY)
        .stroke()
      doc
        .moveTo(lineTo, doc.y)
        .lineTo(lineTo, otherHeaderY)
        .stroke()
    }

    doc.y += 5
    var imageFlag = false
    if (other.monthlyReportOtherImages != null) {
      var deltaWidth = imageDrawSize
      var imageX = 0
      var imageY = 0
      doc.x = pdfLeftMargin
      for (var j = 0; j < other.monthlyReportOtherImages.length; j++) {
        var imageStr = other.monthlyReportOtherImages[j]
        if (imageStr != null) {
          if (imageStr != '') {
            const response = imageList[imageIndex]
            imageIndex += 1
            var imagesSize = new imageSize(response.data)
            deltaWidth = (imageDrawSize / imagesSize.height) * imagesSize.width
            if (doc.y + imageDrawSize >= 840) {
              // NOTE:改ページ判定
              writePageNumber()
              doc.addPage()
              doc.y = 50
              doc.x = pdfLeftMargin
              imageY = 0
            }
            if (doc.x + imageX + deltaWidth > 590) {
              doc.x = pdfLeftMargin
              doc.moveDown()
              imageX = 0
              doc.y = doc.y + imageDrawSize
              if (doc.y >= 830) {
                // NOTE:改ページ判定
                writePageNumber()
                doc.addPage()
                doc.y = 50
                doc.x = pdfLeftMargin
                imageY = 0
              }
            }
            const pngBuffer = Buffer.from(response.data)
            doc
              .image(pngBuffer, doc.x + imageX, doc.y - imageY, {
                fit: [deltaWidth, imageDrawSize]
              })
              .rect(
                doc.x + imageX,
                doc.y - imageDrawSize,
                deltaWidth,
                imageDrawSize
              )
              .stroke()
            imageX += deltaWidth + imageSpaceWidth
            imageY = imageDrawSize
          }
        }
      }
    }
    doc.moveDown()
  }

  writePageNumber()
  doc.fillColor('black')
  doc.end()
}

function out_pdf(res_pdf, rerport_day) {
  var max_y = 0
  var pageNumber = 1
  var countFlag = false
  // NOTE:A4縦サイズ
  const doc = new PDFDocument({
    size: [841.89, 595.28],
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  })
  let filename = buildingName + '_' + report_title + '_' + rerport_day
  filename = encodeURIComponent(filename) + '.pdf'
  res_pdf.setHeader(
    'Content-disposition',
    'attachment; filename="' + filename + '"'
  )
  res_pdf.setHeader('Content-type', 'application/pdf; charset=utf-8')
  doc.font('./static/fonts/meiryo.ttf')
  //メタデータ設定
  doc.info.Title = report_title
  doc.info.Author = 'Taisei'
  doc.info.Keywords = report_title
  doc.info.ModDate = new Date()
  doc.pipe(res_pdf)
  const LINE_TO = 823
  //NOTE:タイトル設定
  var dt = new Date(Date.now())
  doc.fontSize(18).text(buildingName + '   ' + report_title, pdfLeftMargin, 19)
  doc.fontSize(10).text('大成株式会社', 620, 15, { width: 200, align: 'right' })
  doc
    .fontSize(10)
    .text('出力日:' + df2(dt), 620, 28, { width: 200, align: 'right' })
  doc.moveDown()

  doc.lineWidth(0)
  // NOTE:ヘッダー設定

  var temp_y = 50
  let header_text_x = 208
  doc
    .moveTo(pdfLeftMargin, temp_y)
    .lineTo(LINE_TO, temp_y)
    .stroke()
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('ID', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc.fontSize(8).text(report_header.id, header_text_x, temp_y, {
    width: 610,
    align: 'left'
  })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('報告日', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc.fontSize(8).text(df3(report_header.reportedAt), header_text_x, temp_y, {
    width: 610,
    align: 'left'
  })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('ステータス', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(status, header_text_x, temp_y, { width: 610, align: 'left' })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('天気', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc.fontSize(8).text(report_header.weather, header_text_x, temp_y, {
    width: 610,
    align: 'left'
  })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc
    .fontSize(8)
    .text('ビルオーナー', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(buildingOwner, header_text_x, temp_y, { width: 610, align: 'left' })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('報告者', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc.fontSize(8).text(report_header.member.name, header_text_x, temp_y, {
    width: 610,
    align: 'left'
  })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('特記事項', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(
      report_header.notice == null ? ' ' : replaceSpace(report_header.notice),
      header_text_x,
      temp_y,
      { width: 610, align: 'left' }
    )
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('依頼事項', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(
      report_header.comment == null ? ' ' : replaceSpace(report_header.comment),
      header_text_x,
      temp_y,
      { width: 610, align: 'left' }
    )
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  temp_y = doc.y
  doc.font('./static/fonts/meiryo-bold.ttf')
  doc.fontSize(8).text('承認者', 0, temp_y, { width: 200, align: 'right' })
  doc.font('./static/fonts/meiryo.ttf')
  doc
    .fontSize(8)
    .text(approver, header_text_x, temp_y, { width: 610, align: 'left' })
  doc
    .moveTo(pdfLeftMargin, doc.y)
    .lineTo(LINE_TO, doc.y)
    .stroke()

  //NOTE: 縦ライン
  doc
    .moveTo(pdfLeftMargin, 50)
    .lineTo(pdfLeftMargin, doc.y)
    .stroke()
  doc
    .moveTo(LINE_TO, 50)
    .lineTo(LINE_TO, doc.y)
    .stroke()
  doc
    .moveTo(205, 50)
    .lineTo(205, doc.y)
    .stroke()
  //----------------------------------------------

  const writePageNumber = () => {
    doc.fontSize(10).text(pageNumber, 815, 570, {
      width: 20,
      height: 10,
      align: 'right',
      lineBreak: false
    })
    pageNumber = pageNumber + 1
  }
  //NOTE:ボディ設定

  var attendanceFlag = false
  if (!Object.keys(list[0]).length) {
    attendanceFlag = true
  } else if (!list[0].label.includes('勤務スタッフ')) {
    attendanceFlag = true
  }
  if (attendanceFlag) {
    doc.moveDown()
    countFlag = true
    doc.fontSize(15)
    doc.text('業務項目件数', pdfLeftMargin, doc.y)
    doc.fontSize(8)
    var countTX = pdfLeftMargin
    const countTW = 160.3
    var countColumnW = 30
    const tableHeight = 11
    var countTY = doc.y
    for (var counts = 0; counts < countList.length; counts++) {
      if (countList[counts].label != null) {
        doc
          .moveTo(countTX, countTY)
          .lineTo(countTX + countTW, countTY)
          .stroke()
        doc
          .moveTo(countTX, countTY)
          .lineTo(countTX, countTY + tableHeight)
          .stroke()
        doc.text(
          countList[counts].label
            .replace('【報告事項無し】', '')
            .replace('【勤務スタッフ無し】', ''),
          countTX + 3,
          countTY
        )
        countTY += tableHeight
        doc
          .moveTo(countTX + countTW - countColumnW, countTY - tableHeight)
          .lineTo(countTX + countTW - countColumnW, countTY)
          .stroke()
        var countStr = '0'
        if (countList[counts].columns) {
          countStr = countList[counts].data_list.length + ''
        }
        doc.text(
          countStr,
          countTX + countTW - countColumnW + 3,
          countTY - tableHeight,
          { width: 25, height: 10, align: 'right', lineBreak: false }
        )
        doc
          .moveTo(countTX + countTW, countTY - tableHeight)
          .lineTo(countTX + countTW, countTY)
          .stroke()
        doc
          .moveTo(countTX, countTY)
          .lineTo(countTX + countTW, countTY)
          .stroke()

        if (countTX > 600) {
          countTX = pdfLeftMargin
        } else {
          countTX += countTW
          countTY -= tableHeight
        }
      }
    }
  }

  var imageIndex = 0
  var countTableFlag = false
  var groupNames = []
  for (var i = 0; i < list.length; i++) {
    doc.fontSize(10)
    var pagePositionY = doc.y
    doc.moveDown()

    if (list[i].id != null) {
      for (var o = 0; o < categoryList.length; o++) {
        for (var p = 0; p < categoryList[o].majoritems.length; p++) {
          let objc = categoryList[o].majoritems[p]
          objc.reportObjectDefinitions.forEach(function(obj) {
            if (list[i].id == obj.id) {
              const include = groupNames.find((v) => v === objc.name)
              var groupName = ''
              if (include === undefined && objc.name != 'ugo業務') {
                groupNames.push(objc.name)
                groupName = objc.name
              }
              if (groupName != '') {
                if (doc.y >= 490) {
                  // NOTE:改ページ判定
                  writePageNumber()
                  doc.addPage()
                  doc.y = 50
                }
                doc.fontSize(15)
                doc.text(groupName, pdfLeftMargin, doc.y)
                doc
                  .moveTo(pdfLeftMargin - 0.5, doc.y)
                  .lineTo(LINE_TO, doc.y)
                  .stroke()
                doc.y += 15
              }
            }
          })
        }
      }
    }
    doc.fontSize(10)
    if (doc.y >= 510) {
      // NOTE:改ページ判定
      writePageNumber()
      doc.addPage()
      doc.y = 50
    }

    doc.text(list[i].label, pdfLeftMargin, doc.y) // NOTE:大項目名
    if (list[i].columns) {
      // データ存在する場合、下記の処理を行う
      if (doc.y >= 510) {
        // NOTE:改ページ判定
        writePageNumber()
        doc.addPage()
        doc.y = 50
      }
      var col_y = doc.y
      var col_name_x = pdfLeftMargin + 3
      max_y = 0
      doc.font('./static/fonts/meiryo-bold.ttf')
      doc.fontSize(8).text('No.', col_name_x, col_y, {
        width: numberLabelWidth - 4,
        align: 'left'
      })
      doc.font('./static/fonts/meiryo.ttf')
      col_name_x += numberLabelWidth

      var columnWidth =
        (831 - col_name_x - (list[i].columns.length + 1) * 5) /
        list[i].columns.length
      var columnArray = []
      var timeAndStaffSize = 0
      list[i].columns.forEach(function(obj) {
        // NOTE:カラム名
        if (obj.name.match('時間')) {
          columnArray.push(timaAndStaffWidth)
          timeAndStaffSize += 1
        } else if (obj.name.match('スタッフ名')) {
          columnArray.push(timaAndStaffWidth)
          timeAndStaffSize += 1
        } else if (obj.select != null) {
          columnArray.push(timaAndStaffWidth)
          timeAndStaffSize += 1
        } else {
          columnArray.push(0)
        }
      })
      var normalColumnSize =
        (831 -
          col_name_x -
          timaAndStaffWidth * timeAndStaffSize -
          (list[i].columns.length + 1) * 5) /
        (list[i].columns.length - timeAndStaffSize)
      for (var columnI = 0; columnI < columnArray.length; columnI++) {
        if (columnArray[columnI] == 0) {
          columnArray[columnI] = normalColumnSize
        }
      }

      var l = 0

      list[i].columns.forEach(function(obj) {
        // NOTE:カラム名
        columnWidth = columnArray[l]
        l += 1
        doc.fontSize(8)

        doc.font('./static/fonts/meiryo-bold.ttf')
        doc.text(obj.name, col_name_x, col_y + 1, {
          width: columnWidth,
          align: 'left'
        })
        doc.font('./static/fonts/meiryo.ttf') //NOTE:カラム名
        col_name_x += columnWidth + 5
        if (max_y < doc.y) max_y = doc.y //改行あるため、最大値Yを格納
      })
      if (list[i].columns.length > 0) {
        var col_line_x = pdfLeftMargin
        var col_line_y = col_y
        // カラム縦線
        doc.lineWidth(0)
        doc
          .moveTo(col_line_x, col_line_y)
          .lineTo(col_line_x, max_y)
          .stroke()
        col_line_x = col_line_x + numberLabelWidth
        for (var cnt = 0; cnt < list[i].columns.length + 1; cnt++) {
          if (cnt != list[i].columns.length) {
            columnWidth = columnArray[cnt]
          }
          doc.lineWidth(0)

          doc
            .moveTo(Math.round(col_line_x * 10) / 10, col_line_y)
            .lineTo(Math.round(col_line_x * 10) / 10, max_y)
            .stroke()
          col_line_x = col_line_x + columnWidth + 5
        }
        // NOTE:カラム名横線
        doc.lineWidth(0)
        doc
          .moveTo(pdfLeftMargin, col_y)
          .lineTo(LINE_TO, col_y)
          .stroke()
        doc
          .moveTo(pdfLeftMargin, max_y)
          .lineTo(LINE_TO, max_y)
          .stroke()
      }

      //NOTE:データ部、複数件あり
      var columnIndex = 1
      list[i].data_list.forEach(function(obj) {
        doc.moveDown()
        doc.lineWidth(0)
        // if (doc.y >= 480) {
        //   // NOTE:改ページ
        //   writePageNumber();
        //   doc.addPage();
        //   doc.y = 50;
        //   max_y = 0;
        //   doc.moveTo(pdfLeftMargin-0.5, doc.y - 15).lineTo(832.5, doc.y - 15).stroke()
        // }

        l = 0
        var addPageFlag = false
        obj.columns.forEach(function(obj1) {
          if (obj1.value != null) {
            columnWidth = columnArray[l]
            l += 1

            var height =
              Math.ceil(obj1.value.length / (columnWidth / 8.197)) * 9 + doc.y
            if (height > 520) {
              addPageFlag = true
            }
          }
        })

        var addPageY = 0
        if (addPageFlag) {
          writePageNumber()
          doc.addPage()
          doc.y = 50
          max_y = 0
          doc.lineWidth(0)
          doc
            .moveTo(pdfLeftMargin, doc.y - 15)
            .lineTo(LINE_TO, doc.y - 15)
            .stroke()
          addPageY = 3
        }
        // NOTE:小項目データ
        var data_name_x = pdfLeftMargin
        var data_name_y = 0
        if (doc.y > max_y) {
          data_name_y = doc.y - 10 - addPageY
        } else {
          data_name_y = max_y
        }
        const data_margin_top = 1.5
        data_name_y -= data_margin_top

        max_y = 0

        doc.fontSize(8)
        doc.text(columnIndex, data_name_x + 3, data_name_y, {
          width: timaAndStaffWidth,
          align: 'left'
        })
        columnIndex += 1
        data_name_x += numberLabelWidth

        l = 0
        obj.columns.forEach(function(obj1) {
          columnWidth = columnArray[l]
          l += 1
          if (doc.y == 50) {
            //NOTE:データ改行ある場合、横線を引く
            doc.lineWidth(0)
            doc
              .moveTo(pdfLeftMargin, doc.y - 15)
              .lineTo(LINE_TO, doc.y - 15)
              .stroke()
          }
          doc.fontSize(8)
          var objValue = ' '
          if (obj1.value != undefined) {
            objValue = obj1.value
          }
          doc.text(objValue, data_name_x + 3, data_name_y, {
            width: columnWidth,
            align: 'left'
          }) //NOTE:小項目データ
          data_name_x += columnWidth + 5
          if (max_y < doc.y) max_y = doc.y //改行あるため、最大値Yを格納
        })

        //カラム縦線
        var col_line_x = pdfLeftMargin
        var col_line_y =
          data_name_y == 40
            ? data_name_y - 5 + addPageY * 3.6
            : data_name_y - 13 + addPageY * 3.6
        doc.lineWidth(0)
        doc
          .moveTo(col_line_x, col_line_y + data_margin_top)
          .lineTo(col_line_x, max_y)
          .stroke()
        col_line_x = col_line_x + numberLabelWidth
        for (var cnt = 0; cnt < obj.columns.length + 1; cnt++) {
          if (cnt != list[i].columns.length) {
            columnWidth = columnArray[cnt]
          }
          doc.lineWidth(0)
          doc
            .moveTo(
              Math.round(col_line_x * 10) / 10,
              col_line_y + data_margin_top
            )
            .lineTo(Math.round(col_line_x * 10) / 10, max_y)
            .stroke()
          col_line_x = col_line_x + columnWidth + 5
        }
        // NOTE:データ部　横線
        doc.lineWidth(0)
        doc
          .moveTo(pdfLeftMargin, max_y)
          .lineTo(LINE_TO, max_y)
          .stroke()
        doc.y = max_y
      })
      // 改行あるため、カーソルを一番行数長い箇所に移動
      doc.y = max_y

      var imageNumberIndex = 0
      if (list[i].image_list != null) {
        if (list[i].image_list.length != 0) {
          //NOTE:画像部分
          var deltaWidth = imageDrawSize
          var imageX = 0
          var imageY = 0
          doc.moveDown()
          doc.x = pdfLeftMargin
          if (doc.y >= 440) {
            // NOTE:改ページ判定
            writePageNumber()
            doc.addPage()
            doc.y = 50
            doc.x = pdfLeftMargin
          }
          for (const obj of list[i].image_list) {
            imageNumberIndex += 1
            if (obj.value != null) {
              const response = imageList[imageIndex]
              imageIndex += 1
              var imagesSize = new imageSize(response.data)
              deltaWidth =
                (imageDrawSize / imagesSize.height) * imagesSize.width
              if (doc.x + imageX + deltaWidth > 841) {
                doc.x = pdfLeftMargin
                doc.moveDown()
                imageX = 0
                doc.y = doc.y + imageDrawSize + imageSpaceWidth
                if (doc.y >= 500) {
                  // NOTE:改ページ判定
                  writePageNumber()
                  doc.addPage()
                  doc.y = 50
                  doc.x = pdfLeftMargin
                  imageY = 0
                }
              }
              const pngBuffer = Buffer.from(response.data)
              if (deltaWidth < dateLabelWidth) {
                doc
                  .fontSize(8)
                  .text(
                    'No.' + getImageNo(obj.id) + ':' + obj.date,
                    doc.x + imageX,
                    doc.y - imageY,
                    { width: dateLabelWidth, align: 'left' }
                  )
                doc
                  .image(pngBuffer, doc.x, doc.y, {
                    fit: [deltaWidth, imageDrawSize]
                  })
                  .rect(doc.x, doc.y - imageDrawSize, deltaWidth, imageDrawSize)
                  .stroke()
                imageX = dateLabelWidth + imageSpaceWidth
              } else {
                // doc.fontSize(8).text("No."+getImageNo(obj.id)+":"+obj.date,doc.x + imageX,doc.y - imageY, { width: deltaWidth, align: 'left' })
                doc
                  .fontSize(8)
                  .text(
                    'No.' + getImageNo(obj.id) + ':' + obj.event,
                    doc.x + imageX,
                    doc.y - imageY,
                    { width: deltaWidth, align: 'left' }
                  )
                doc
                  .image(pngBuffer, doc.x, doc.y, {
                    fit: [deltaWidth, imageDrawSize]
                  })
                  .rect(doc.x, doc.y - imageDrawSize, deltaWidth, imageDrawSize)
                  .stroke()
                imageX = deltaWidth + imageSpaceWidth
              }
              imageY = imageDrawSize + 12
            }
          }
        }
      }

      // doc.moveDown();
    }

    if (!countFlag) {
      if (doc.y >= 390) {
        // NOTE:改ページ判定
        writePageNumber()
        doc.addPage()
        doc.y = 0
      }
      countFlag = true
      doc.moveDown()
      doc.fontSize(15)
      doc.text('業務項目件数', pdfLeftMargin, doc.y)
      doc.fontSize(8)
      var countTX = pdfLeftMargin
      const countTW = 160.6
      var countColumnW = 30
      const tableHeight = 11
      var countTY = doc.y
      for (var counts = 0; counts < countList.length; counts++) {
        if (countList[counts].label != null) {
          doc
            .moveTo(countTX, countTY)
            .lineTo(countTX + countTW, countTY)
            .stroke()
          doc
            .moveTo(countTX, countTY)
            .lineTo(countTX, countTY + tableHeight)
            .stroke()
          doc.text(
            countList[counts].label
              .replace('【報告事項無し】', '')
              .replace('【勤務スタッフ無し】', ''),
            countTX + 3,
            countTY
          )
          countTY += tableHeight
          doc
            .moveTo(countTX + countTW - countColumnW, countTY - tableHeight)
            .lineTo(countTX + countTW - countColumnW, countTY)
            .stroke()
          var countStr = '0'
          if (countList[counts].columns) {
            countStr = countList[counts].data_list.length + ''
          }
          doc.text(
            countStr,
            countTX + countTW - countColumnW + 3,
            countTY - tableHeight,
            { width: 25, height: 10, align: 'right', lineBreak: false }
          )
          doc
            .moveTo(countTX + countTW, countTY - tableHeight)
            .lineTo(countTX + countTW, countTY)
            .stroke()
          doc
            .moveTo(countTX, countTY)
            .lineTo(countTX + countTW, countTY)
            .stroke()

          if (countTX > 600) {
            countTX = pdfLeftMargin
          } else {
            countTX += countTW
            countTY -= tableHeight
          }
        }
      }
    }
  }
  writePageNumber()
  doc.fillColor('black')
  doc.end()
}

async function beforeOtherImageDownload() {
  const getBuffers = async () => {
    for (var i = 0; i < otherList.length; i++) {
      if (otherList[i].monthlyReportOtherImages != null) {
        for (var j = 0; j < otherList[i].monthlyReportOtherImages.length; j++) {
          var obj = otherList[i].monthlyReportOtherImages[j]
          if (obj != null) {
            if (obj.filePath != null) {
              const response = await axios.get(imageHeaderUrl + obj.filePath, {
                responseType: 'arraybuffer'
              })
              imageList.push(response)
            } else if (obj != '') {
              const response = await axios.get(imageHeaderUrl + obj, {
                responseType: 'arraybuffer'
              })
              imageList.push(response)
            }
          }
        }
      }
    }
  }
  const buffers = await getBuffers()
  return buffers
}

async function beforeDownload() {
  const getBuffers = async () => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].image_list != null) {
        for (const obj of list[i].image_list) {
          if (obj.value != null) {
            const response = await axios.get(imageHeaderUrl + obj.value, {
              responseType: 'arraybuffer'
            })
            imageList.push(response)
          }
        }
      }
    }
  }
  const buffers = await getBuffers()
  return buffers
}

function getDataUri(url, callback) {
  var http = require('http')

  http
    .get(url, (resp) => {
      resp.setEncoding('base64')
      var body = 'data:' + resp.headers['content-type'] + ';base64,'
      resp.on('data', (data) => {
        body += data
      })
      resp.on('end', () => {
        callback(body)
        //return res.json({result: body, status: 'success'});
      })
    })
    .on('error', (e) => {
      callback(null)
      console.log(`Got error: ${e.message}`)
    })
}

function df2(date, format) {
  if (date == null) {
    return '---'
  }
  try {
    if (date < 10000000000) date *= 1000
    date = new Date(date)
    date.setHours(date.getHours() + 9)
    return date ? dateFormat(date, format || 'yyyy/mm/dd HH:MM') : '---'
  } catch (e) {
    return '---'
  }
}
function df3(date, format) {
  try {
    if (date < 10000000000) date *= 1000
    date = new Date(date)
    date.setHours(date.getHours() + 9)
    return date ? dateFormat(date, format || 'yyyy/mm/dd') : '---'
  } catch (e) {
    return '---'
  }
}
function dfJapanString(date, format) {
  try {
    if (date < 10000000000) date *= 1000
    date = new Date(date)
    date.setHours(date.getHours() + 9)
    return date ? dateFormat(date, format || 'yyyy年mm月') : '---'
  } catch (e) {
    return '---'
  }
}
function getMember(val) {
  for (var i = 0; i < allMembers.length; i++) {
    if (allMembers[i].value == val) {
      return allMembers[i].name
    }
  }
}
function getReportSections(val, req, label_switch) {
  var reportData = {}
  // NOTE: 大項目定義回数ループ
  for (var i = 0; i < val.length; i++) {
    if (Object.keys(val[i]).length) {
      if (
        val[i].reportObjectDefinition.id == 30 ||
        val[i].reportObjectDefinition.id == 31
      ) {
        continue
      }
      // NOTE: 大項目のデータがない時&&大項目表示ラベル制御が表示の時
      if (val[i].reportObjects === undefined) {
        countList.push({
          label: val[i].reportObjectDefinition.name,
          sort: val[i].reportObjectDefinition.sort
        })
        if (label_switch == 'true') {
          reportData = {
            id: val[i].reportObjectDefinition.id,
            label: val[i].reportObjectDefinition.name + ' 【報告事項無し】',
            sort: val[i].reportObjectDefinition.sort
          }
        }
      } else {
        saveFloorData(val[i])
        if (req.body.isApproval == 'true') {
          reportData = getApprovalReportData(val[i])
        } else {
          reportData = getReportData(val[i])
        }
        countList.push(reportData)
      }
      if (Object.keys(reportData).length != 0) {
        list.push(reportData)
        reportData = {}
      }
    }
  }
  // list.sort(function(a,b){
  //   if(a.sort < b.sort) return -1;
  //   if(a.sort > b.sort) return 1;
  //     return 0;
  // });
  // countList.sort(function(a,b){
  //   if(a.sort < b.sort) return -1;
  //   if(a.sort > b.sort) return 1;
  //     return 0;
  // });
}

function saveFloorData(value) {
  var reportFieldDefinitions =
    value.reportObjectDefinition.reportFieldDefinitions
  if (typeof value.reportObjectDefinition.reportFieldDefinitions != 'object') {
    reportFieldDefinitions = JSON.parse(
      value.reportObjectDefinition.reportFieldDefinitions
    )
  }
  var find = reportFieldDefinitions.find((val) => val.type == 9)
  if (find != undefined) {
    floorDatas.push(value)
  }
}

function getReportFiledDefinition(val) {
  var data = []
  //val.reportObjectDefinition.reportFieldDefinitions = JSON.parse(val.reportObjectDefinition.reportFieldDefinitions)
  // NOTE: 大項目データ項目定義回数ループ
  var reportFieldDefinitions = val.reportObjectDefinition.reportFieldDefinitions
  if (typeof val.reportObjectDefinition.reportFieldDefinitions != 'object') {
    reportFieldDefinitions = JSON.parse(
      val.reportObjectDefinition.reportFieldDefinitions
    )
  }
  for (var i = 0; i < reportFieldDefinitions.length; i++) {
    if (
      reportFieldDefinitions[i].type != 7 &&
      reportFieldDefinitions[i].type != 10 &&
      val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport ==
        true
    ) {
      if (reportFieldDefinitions[i].type == 4) {
        data.push({
          name: reportFieldDefinitions[i].name,
          type: reportFieldDefinitions[i].type,
          id: reportFieldDefinitions[i].reportObjectDefinitionId,
          fieldId: reportFieldDefinitions[i].id,
          select: true
        })
        //data.push({ name: val.reportObjectDefinition.reportFieldDefinitions[i].name,select:true });
      } else {
        // var reportFieldDefinition = val.reportObjectDefinition.reportFieldDefinitions[i];
        // if (typeof(val.reportObjectDefinition.reportFieldDefinitions[i]) != 'object') {
        //   console.log("hoge");
        //   console.log(val.reportObjectDefinition.reportFieldDefinitions[i])
        //   reportFieldDefinition  = JSON.parse(val.reportObjectDefinition.reportFieldDefinitions[i]);
        // }
        if (!reportFieldDefinitions[i].name.includes('URL')) {
          data.push({
            name: reportFieldDefinitions[i].name,
            type: reportFieldDefinitions[i].type,
            id: reportFieldDefinitions[i].reportObjectDefinitionId,
            fieldId: reportFieldDefinitions[i].id
          })
          // data.push({name: val.reportObjectDefinition.reportFieldDefinitions[i].name});
        }
      }
    }
  }
  return data
}
function floorSortForAsc(underGround, ground, uniq, other, fieldId) {
  underGround.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) >
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) <
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  ground.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) <
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) >
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  var result = []
  underGround.forEach((val) => {
    result.push(val)
  })
  ground.forEach((val) => {
    result.push(val)
  })
  uniq.forEach((val) => {
    result.push(val)
  })
  other.forEach((val) => {
    result.push(val)
  })
  return result
}
function floorSortForDesc(underGround, ground, uniq, other, fieldId) {
  underGround.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) <
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) >
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  ground.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) >
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.reportFieldFloors[0].floor.name) <
      parseInt(findb.reportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  var result = []
  uniq.forEach((val) => {
    result.push(val)
  })
  ground.forEach((val) => {
    result.push(val)
  })
  underGround.forEach((val) => {
    result.push(val)
  })
  other.forEach((val) => {
    result.push(val)
  })
  return result
}
function isFloorSort(id, fieldId, isAsc) {
  var find = floorDatas.find((val) => val.reportObjectDefinition.id == id)
  var underGround = find.reportObjects.filter((val) => {
    var find2 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find2.reportFieldFloors != undefined &&
      find2.reportFieldFloors[0].floor.type == 2
    ) {
      return true
    }
  })
  var ground = find.reportObjects.filter((val) => {
    var find1 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find1.reportFieldFloors != undefined &&
      find1.reportFieldFloors[0].floor.type == 1
    ) {
      return true
    }
  })
  var uniq = find.reportObjects.filter((val) => {
    var find3 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find3.reportFieldFloors != undefined &&
      find3.reportFieldFloors[0].floor.type == 3
    ) {
      return true
    }
  })
  var other = find.reportObjects.filter((val) => {
    var find4 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (find4.reportFieldFloors == undefined) {
      return true
    }
  })
  var result
  if (isAsc) {
    result = floorSortForAsc(underGround, ground, uniq, other, fieldId)
  } else {
    result = floorSortForDesc(underGround, ground, uniq, other, fieldId)
  }

  var data = getReportData({
    reportObjectDefinition: find.reportObjectDefinition,
    reportObjects: result
  })
  list.splice(list.findIndex(({ id }) => id == data.id), 1, data)
}
function isApproveFloorSort(id, fieldId, isAsc) {
  var find = floorDatas.find((val) => val.reportObjectDefinition.id == id)
  var underGround = find.reportObjects.filter((val) => {
    var find2 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find2.approveReportFieldFloors != undefined &&
      find2.approveReportFieldFloors[0].floor.type == 2
    ) {
      return true
    }
  })
  var ground = find.reportObjects.filter((val) => {
    var find1 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find1.approveReportFieldFloors != undefined &&
      find1.approveReportFieldFloors[0].floor.type == 1
    ) {
      return true
    }
  })
  var uniq = find.reportObjects.filter((val) => {
    var find3 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (
      find3.approveReportFieldFloors != undefined &&
      find3.approveReportFieldFloors[0].floor.type == 3
    ) {
      return true
    }
  })
  var other = find.reportObjects.filter((val) => {
    var find4 = val.reportFields.find(
      (value) => value.reportFieldDefinitionId == fieldId
    )
    if (find4.approveReportFieldFloors == undefined) {
      return true
    }
  })
  var result
  if (isAsc) {
    result = approvalFloorSortForAsc(underGround, ground, uniq, other, fieldId)
  } else {
    result = approvalFloorSortForDesc(underGround, ground, uniq, other, fieldId)
  }

  var data = getApprovalReportData({
    reportObjectDefinition: find.reportObjectDefinition,
    reportObjects: result
  })
  list.splice(list.findIndex(({ id }) => id == data.id), 1, data)
}

function approvalFloorSortForAsc(underGround, ground, uniq, other, fieldId) {
  underGround.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) >
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) <
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  ground.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) <
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) >
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  var result = []
  underGround.forEach((val) => {
    result.push(val)
  })
  ground.forEach((val) => {
    result.push(val)
  })
  uniq.forEach((val) => {
    result.push(val)
  })
  other.forEach((val) => {
    result.push(val)
  })
  return result
}
function approvalFloorSortForDesc(underGround, ground, uniq, other, fieldId) {
  underGround.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) <
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) >
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  ground.sort(function(a, b) {
    var finda = a.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    var findb = b.reportFields.find(
      (val) => val.reportFieldDefinitionId == fieldId
    )
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) >
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return -1
    }
    if (
      parseInt(finda.approveReportFieldFloors[0].floor.name) <
      parseInt(findb.approveReportFieldFloors[0].floor.name)
    ) {
      return 1
    }
    return 0
  })
  var result = []
  uniq.forEach((val) => {
    result.push(val)
  })
  ground.forEach((val) => {
    result.push(val)
  })
  underGround.forEach((val) => {
    result.push(val)
  })
  other.forEach((val) => {
    result.push(val)
  })
  return result
}
function getImageNo(id) {
  return parseInt(id.substring(0, id.indexOf('_'))) + 1
}
function sortReportObject(val) {
  var findReportExtractField = val.reportObjectDefinition.reportFieldDefinitions.find(
    (reportObjectDefinition) =>
      reportObjectDefinition.reportExtractField == true
  )
  val.reportObjects.sort(function(a, b) {
    if (
      a.reportFields[findReportExtractField.fieldIndex].dateValue <
      b.reportFields[findReportExtractField.fieldIndex].dateValue
    ) {
      return -1
    } else {
      return 1
    }
  })
  return val
}
function getReportData(val) {
  var sortVal = val
  if (sortSettings.length == 0) {
    sortVal = sortReportObject(val)
  }
  var data_list = []
  var image_list = []
  if (sortVal.reportObjects == undefined) return null
  // NOTE: 大項目データ回数ループ
  for (var i = 0; i < sortVal.reportObjects.length; i++) {
    var path =
      '/majoritems/details/' +
      sortVal.reportObjects[i].reportObjectDefinitionId +
      '/' +
      sortVal.reportObjects[i].id
    var columns = getColumnsData(sortVal, i)
    var dateValue = ''
    var eventName = ''

    for (var j = 0; j < sortVal.reportObjects[i].reportFields.length; j++) {
      if (
        val.reportObjects[i].reportFields[j].reportFieldDefinitionId == 170 ||
        val.reportObjects[i].reportFields[j].reportFieldDefinitionId == 181
      ) {
        eventName = val.reportObjects[i].reportFields[j].textValue
      }
      for (
        var k = 0;
        k < sortVal.reportObjectDefinition.reportFieldDefinitions.length;
        k++
      ) {
        if (
          sortVal.reportObjectDefinition.reportFieldDefinitions[k].id ==
          sortVal.reportObjects[i].reportFields[j].reportFieldDefinitionId
        ) {
          if (
            sortVal.reportObjectDefinition.reportFieldDefinitions[k].type == 2
          ) {
            dateValue = df2(sortVal.reportObjects[i].reportFields[j].dateValue)
          }

          if (
            sortVal.reportObjectDefinition.reportFieldDefinitions[k].type == 7
          ) {
            if (sortVal.reportObjects[i].reportFields[j].textValue != null) {
              image_list.push({
                value: sortVal.reportObjects[i].reportFields[j].textValue,
                id: i + '_' + j,
                date: dateValue,
                event: eventName
              })
            }
          }
        }
      }
    }
    data_list.push({ path, columns })
  }
  var data = {
    id: sortVal.reportObjectDefinition.id,
    label: sortVal.reportObjectDefinition.name,
    sort: sortVal.reportObjectDefinition.sort,
    columns: getReportFiledDefinition(sortVal),
    data_list: data_list,
    image_list: image_list
  }
  return data
}
function sortApproveReportObject(val) {
  var reportFieldDefinitions = val.reportObjectDefinition.reportFieldDefinitions
  if (typeof val.reportObjectDefinition.reportFieldDefinitions != 'object') {
    reportFieldDefinitions = JSON.parse(
      val.reportObjectDefinition.reportFieldDefinitions
    )
  }
  var findReportExtractField = reportFieldDefinitions.find(
    (value) => value.reportExtractField == true
  )
  val.reportObjects.sort(function(a, b) {
    if (
      a.reportFields[findReportExtractField.fieldIndex].dateValue <
      b.reportFields[findReportExtractField.fieldIndex].dateValue
    ) {
      return -1
    } else {
      return 1
    }
  })
  return val
}
function getApprovalReportData(val) {
  var sortVal = val
  if (sortSettings.length == 0) {
    sortVal = sortApproveReportObject(val)
  }
  // var sortVal = sortApproveReportObject(val);
  var data_list = []
  var image_list = []
  if (sortVal.reportObjects == undefined) return null
  // NOTE: 大項目データ回数ループ
  for (var i = 0; i < sortVal.reportObjects.length; i++) {
    var path =
      '/majoritems/details/' +
      sortVal.reportObjects[i].reportObjectDefinitionId +
      '/' +
      sortVal.reportObjects[i].id
    var columns = getApproveColumnsData(sortVal, i)
    var dateValue = ''
    for (var j = 0; j < sortVal.reportObjects[i].reportFields.length; j++) {
      for (
        var k = 0;
        k < sortVal.reportObjectDefinition.reportFieldDefinitions.length;
        k++
      ) {
        if (
          sortVal.reportObjectDefinition.reportFieldDefinitions[k].id ==
          sortVal.reportObjects[i].reportFields[j].reportFieldDefinitionId
        ) {
          if (
            sortVal.reportObjectDefinition.reportFieldDefinitions[k].type == 2
          ) {
            dateValue = df2(sortVal.reportObjects[i].reportFields[j].dateValue)
          }

          if (
            sortVal.reportObjectDefinition.reportFieldDefinitions[k].type == 7
          ) {
            if (sortVal.reportObjects[i].reportFields[j].textValue != null) {
              image_list.push({
                value: sortVal.reportObjects[i].reportFields[j].textValue,
                id: i + '_' + j,
                date: dateValue
              })
            }
          }
        }
      }
    }
    data_list.push({ path, columns })
  }
  var data = {
    id: sortVal.reportObjectDefinition.id,
    label: sortVal.reportObjectDefinition.name,
    sort: sortVal.reportObjectDefinition.sort,
    columns: getReportFiledDefinition(sortVal),
    data_list: data_list,
    image_list: image_list
  }
  return data
}
function replaceSpace(str) {
  var spStr = [
    9, // 水平タブ
    8203 // ゼロ幅スペース
  ]

  var replacedStr = ''
  var strs = '' + str
  for (var i = 0; i < strs.length; i++) {
    var chr = strs.charCodeAt(i)
    if (spStr.indexOf(chr) == -1) {
      if (chr == 13) {
        String.fromCharCode(10)
      } else {
        replacedStr += String.fromCharCode(chr)
      }
    } else {
      replacedStr += ' '
    }
  }
  return replacedStr
}

function getColumData(val) {
  if (val == null || val == '') {
    return '---'
  }
  if (val.label != null) {
    return replaceSpace(val.label)
  }
  if (val.name != null) {
    return replaceSpace(val.name)
  }

  if (Number.isInteger(val)) {
    return val
  }

  return replaceSpace(val)
}

/**
 * 一覧/報告書に必要なフロア情報のみ抽出
 */
function getExtractFloorsData(floors) {
  var res = []
  if (floors == undefined) {
    return res
  }
  for (var i = 0; i < floors.length; i++) {
    if (floors[i]) {
      if (floors[i].floor){
        res.push(floors[i].floor)
      }
    }
  }
  return res
}

/**
 * フロアタイプごとのデータの並び替え
 */
function sortFloorType(floors, type) {
  var resData = floors.filter(function(a) {
    return a.type == type
  })
  resData.sort(function(a, b) {
    if (parseInt(a.name) < parseInt(b.name)) {
      return -1
    } else {
      return 1
    }
  })
  return resData
}

/**
 * フロアデータの再生成
 */
function composeFloors(res, type_data) {
  for (var i = 0; i < type_data.length; i++) {
    res.push(type_data[i])
  }
  return res
}

/**
 * apiから取得したフロアデータの並び替え
 */
function sortFloors(floors) {
  var res = []
  res = composeFloors(res, sortFloorType(floors, 1))
  res = composeFloors(res, sortFloorType(floors, 2))
  res = composeFloors(
    res,
    floors.filter(function(a) {
      return a.type == 3
    })
  )
  return res
}

/**
 * フロアデータを表示用に整形
 */
function convertFloors(floors, checkFloors, isCheck) {
  var allFloors = [],
    displayFloors = []
  var name

  for (var i = 0; i < floors.length; i++) {
    if (floors[i].type == '2') {
      name = 'B' + floors[i].name
    } else {
      name = floors[i].name
    }
    if (checkFloors != null) {
      if (checkFloors.indexOf(floors[i].id) != -1) {
        allFloors.push({
          name: name,
          value: floors[i].name,
          type: 'checkbox',
          id: floors[i].id,
          checked: true,
          floor_type: floors[i].type
        })
        displayFloors.push({
          name: name,
          value: floors[i].name,
          type: 'checkbox',
          id: floors[i].id,
          checked: true,
          floor_type: floors[i].type
        })
      } else {
        allFloors.push({
          name: name,
          value: floors[i].name,
          type: 'checkbox',
          id: floors[i].id,
          checked: false,
          floor_type: floors[i].type
        })
      }
    } else {
      displayFloors.push({
        name: name,
        value: floors[i].name,
        type: 'checkbox',
        id: floors[i].id,
        checked: true,
        floor_type: floors[i].type
      })
      allFloors.push({
        name: name,
        value: floors[i].name,
        type: 'checkbox',
        id: floors[i].id,
        checked: true,
        floor_type: floors[i].type
      })
    }
  }
  var res = isCheck ? displayFloors : allFloors
  return res
}

/**
 * フロアデータの表示フォーマット
 */
function floorFormat(floors) {
  var displayFloor = ''
  for (var i = 0; i < floors.length; i++) {
    if (i == 0) {
      switch (floors[i].floor_type) {
        case 1:
          displayFloor += floors[i].value + 'F'
          break
        case 2:
          displayFloor += 'B' + floors[i].value + 'F'
          break
        case 3:
          displayFloor += floors[i].value
          break
      }
    } else if (i == floors.length - 1) {
      if (floors[i].floor_type == floors[i - 1].floor_type) {
        if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) + 1) {
          displayFloor += ', '
        } else {
          displayFloor += '~'
        }
      } else {
        displayFloor += ', '
      }
      switch (floors[i].floor_type) {
        case 1:
          displayFloor += floors[i].value + 'F'
          break
        case 2:
          displayFloor += 'B' + floors[i].value + 'F'
          break
        case 3:
          displayFloor += floors[i].value
          break
      }
    } else {
      if (floors[i].floor_type == floors[i - 1].floor_type) {
        if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) + 1) {
          switch (floors[i].floor_type) {
            case 1:
              displayFloor += ', ' + floors[i].value + 'F'
              break
            case 2:
              displayFloor += ', ' + 'B' + floors[i].value + 'F'
              break
            case 3:
              displayFloor += ', ' + floors[i].value
              break
          }
        } else {
          if (parseInt(floors[i].value) != parseInt(floors[i + 1].value) - 1) {
            switch (floors[i].floor_type) {
              case 1:
                displayFloor += '~' + floors[i].value + 'F'
                break
              case 2:
                displayFloor += '~' + 'B' + floors[i].value + 'F'
                break
              case 3:
                displayFloor += floors[i].value
                break
            }
          }
        }
      } else {
        switch (floors[i].floor_type) {
          case 2:
            displayFloor += ', ' + 'B' + floors[i].value + 'F'
            break
          case 3:
            displayFloor += ', ' + floors[i].value
            break
        }
      }
    }
  }
  return displayFloor
}

/**
 * フロア表示
 * floors: そのビルで有効なフロアすべて
 * checkFloors: モーダルウィンドウでチェック済みのフロア
 * isText: テキスト表示用フラグ
 */
function getDisplayFloor(floors, checkFloors, isText) {
  var res
  if (isText) {
    res = floorFormat(convertFloors(sortFloors(floors), checkFloors, true))
  } else {
    res = convertFloors(sortFloors(floors), checkFloors, false)
  }
  return res
}

function getColumnsData(val, cnt) {
  var data = []
  var reportFieldDefinitions = val.reportObjectDefinition.reportFieldDefinitions
  if (typeof val.reportObjectDefinition.reportFieldDefinitions != 'object') {
    reportFieldDefinitions = JSON.parse(
      val.reportObjectDefinition.reportFieldDefinitions
    )
  }
  for (var i = 0; i < reportFieldDefinitions.length; i++) {
    if (
      !val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport
    ) {
      continue
    }
    var report = val.reportObjects[cnt].reportFields.find(
      (v) =>
        v.reportFieldDefinitionId ===
        val.reportObjectDefinition.reportFieldDefinitions[i].id
    )
    if (report == null) {
      // data.push({ value: '---' })
    } else {
      switch (reportFieldDefinitions[i].type) {
        case 1:
        case 6:
          if (!reportFieldDefinitions[i].name.includes('URL')) {
            data.push({ value: getColumData(report.textValue) })
          }
          break
        case 2:
          data.push({ value: getColumData(df2(report.dateValue)) })
          break
        case 3:
          data.push({ value: getColumData(report.numberValue) })
          break
        case 4:
          data.push({ value: getColumData(report.selectOptionDefinition) })
          break
        case 5:
          data.push({ value: getColumData(report.member) })
          break
        case 8:
        case 9:
          data.push({
            value: getColumData(
              getDisplayFloor(
                getExtractFloorsData(report.reportFieldFloors),
                null,
                true
              )
            )
          })
        default:
          break
      }
    }
  }
  return data
}
function getApproveColumnsData(val, cnt) {
  var data = []
  var reportFieldDefinitions = val.reportObjectDefinition.reportFieldDefinitions
  if (typeof val.reportObjectDefinition.reportFieldDefinitions != 'object') {
    reportFieldDefinitions = JSON.parse(
      val.reportObjectDefinition.reportFieldDefinitions
    )
  }
  for (var i = 0; i < reportFieldDefinitions.length; i++) {
    if (
      !val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport
    ) {
      continue
    }
    var report = val.reportObjects[cnt].reportFields.find(
      (v) => v.reportFieldDefinitionId === reportFieldDefinitions[i].id
    )
    if (report == null) {
      // data.push({ value: '---' })
    } else {
      switch (reportFieldDefinitions[i].type) {
        case 1:
        case 6:
          if (!reportFieldDefinitions[i].name.includes('URL')) {
            data.push({ value: getColumData(report.textValue) })
          }
          break
        case 2:
          data.push({ value: getColumData(df2(report.dateValue)) })
          break
        case 3:
          data.push({ value: getColumData(report.numberValue) })
          break
        case 4:
          data.push({
            value: getSelectValue(
              report.reportObjectDefinitionId,
              report.selectOptionDefinitionId
            )
          })
          break
        case 5:
          data.push({ value: getMember(report.memberId) })
          break
        case 8:
        case 9:
          data.push({
            value: getColumData(
              getDisplayFloor(
                getExtractFloorsData(
                  getReportFieldFloors(report.approveReportFieldFloors)
                ),
                null,
                true
              )
            )
          })
        default:
          break
      }
    }
  }
  return data
}
function getReportFieldFloors(approveFloors) {
  if (approveFloors != undefined) {
    for (var i = 0; i < approveFloors.length; i++) {
      for (var j = 0; j < builFloors.length; j++) {
        if (approveFloors[i].floorId == builFloors[j].id) {
          approveFloors[i].floor = builFloors[j]
        }
      }
    }
    return approveFloors
  }
  return ''
}
function getSelectValue(reportId, selectId) {
  for (var i = 0; i < reportSections.length; i++) {
    if (reportSections[i].reportObjectDefinition.id == reportId) {
      for (
        var j = 0;
        j <
        reportSections[i].reportObjectDefinition.reportFieldDefinitions.length;
        j++
      ) {
        if (
          reportSections[i].reportObjectDefinition.reportFieldDefinitions[j]
            .selectOptionDefinitions != undefined
        ) {
          var find = reportSections[
            i
          ].reportObjectDefinition.reportFieldDefinitions[
            j
          ].selectOptionDefinitions.find((value) => value.id == selectId)
          if (find != undefined) {
            return find.label
          }
        }
      }
    }
  }
  return '---'
}
function parseReportSection() {
  for (var i = 0; i < reportSections.length; i++) {
    reportSections[
      i
    ].reportObjectDefinition.reportFieldDefinitions = JSON.parse(
      reportSections[i].reportObjectDefinition.reportFieldDefinitions
    )
  }
}
function getAttendances(val, label_switch) {
  var data_list = []
  var attendances = {}
  if (val.length == 0) {
    if (label_switch == 'true') {
      attendances = { label: '勤務スタッフ 【勤務スタッフ無し】' }
    }
  } else {
    for (var i = 0; i < val.length; i++) {
      var columns = []
      var path = '/attendance/details/' + val[i].id
      columns.push({ value: df2(val[i].attendedAt) })
      columns.push({ value: df2(val[i].leftAt) })
      var workShifts = ['日勤', '宿直', '夜勤', '午前', '午後']
      var workShift = workShifts[parseInt(val[i].workShift) - 1]
      columns.push({ value: workShift })
      columns.push({ value: val[i].member.name })
      data_list.push({ path, columns })
    }
    attendances = {
      label: '勤務スタッフ',
      columns: [
        { name: '出勤時間' },
        { name: '退勤時間' },
        { name: 'シフト' },
        { name: 'メンバー名' }
      ],
      data_list
    }
  }
  list.push(attendances)
}
function getApprovalAttendances(val, label_switch) {
  var data_list = []
  var attendances = {}
  if (val.length == 0) {
    if (label_switch == 'true') {
      attendances = { label: '勤務スタッフ 【勤務スタッフ無し】' }
    }
  } else {
    for (var i = 0; i < val.length; i++) {
      var columns = []
      var path = '/attendance/details/' + val[i].id
      columns.push({ value: df2(val[i].attendedAt) })
      columns.push({ value: df2(val[i].leftAt) })
      var workShifts = ['日勤', '宿直', '夜勤', '午前', '午後']
      var workShift = workShifts[parseInt(val[i].workShift) - 1]
      columns.push({ value: workShift })
      columns.push({ value: getMember(val[i].memberId) })
      data_list.push({ path, columns })
    }
    attendances = {
      label: '勤務スタッフ',
      columns: [
        { name: '出勤時間' },
        { name: '退勤時間' },
        { name: 'シフト' },
        { name: 'メンバー名' }
      ],
      data_list
    }
  }
  list.push(attendances)
}

module.exports = {
  path: '/api',
  handler: router
}

export default router
