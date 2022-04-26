import request from '@utils/request'
const VIEW_ID = '201723032'
const clientId =
    '290512385831-dmghl5rmcej3pvvap0lrt261tk1ijdrv.apps.googleusercontent.com';
const path = '/v4/reports:batchGet';
const root = 'https://analyticsreporting.googleapis.com/';
const method = 'POST';

export const actions = {
    initGA({
        commit
    }) {
        fetch('https://developers.google.com/oauthplayground/sendRequest', {
                body: JSON.stringify({
                    Method: 'POST',
                    absoluteURI: 'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': '188',
                    },
                    'message-body': JSON.stringify({
                        reportRequests: [{
                            viewId: '201723032',
                            dateRanges: [{
                                startDate: '2020-01-09',
                                endDate: '2020-01-10',
                            }, ],
                            metrics: [{
                                expression: 'ga:pageviews',
                            }, ],
                            dimensions: [{
                                name: 'ga:language',
                            }, ],
                        }, ],
                    }),
                    access_token: 'ya29.Il-9BxqOdKmwdG2ic5Qazfp_gAMAQrKQeMZ67ghtIb0HdFwC6NbVAC6imba2epE1AlcuQd88S7fdhybDPu4_p3Paw66ZMUcdJcrtNMc_IksmVrt-gTI8Gw85ZNVb0ObxHQ',
                    access_token_type: 'bearer',
                }), // must match 'Content-Type' header
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'no-cors',
            })
            .then((res) => res.json())
            .catch((error) => console.error('Error:', error))
            .then((response) => console.log('Success:', response))

        return gapi.auth2
            .init({
                clientId,
            })
            .then((authInstance) => {
                // console.log('signed in', gapi.auth2.getAuthInstance().isSignedIn.get())
            }, console.error.bind(console))
    },
    fetchGA({
        commit
    }, payload) {
        // console.log('payload', payload)
        fetch
        return gapi.client
            .request({
                path,
                root,
                method,
                body: {
                    reportRequests: [{
                        viewId: VIEW_ID,
                        dateRanges: [{
                            startDate: payload.startDate,
                            endDate: payload.endDate,
                        }, ],
                        metrics: [{
                            expression: 'ga:pageviews',
                        }, ],
                        dimensions: [{
                            name: 'ga:language',
                        }, ],
                    }, ],
                },
            })
            .then(payload.callback, console.error.bind(console))
    },
    fetchReportByCustomer({
        commit
    }, payload) {
        return request.post('/admin/order/report/customers', payload).then((response) => response.items)
    },
    fetchReportByProducts({
        commit
    }, payload) {
        return request.post('admin/order/report/product/multi', payload).then((response) => response.items)
    },
    fetchReportByProductCategory({
        commit
    }, payload) {
        return request.post('admin/order/report/product/category', payload).then((response) => response.items[0])
    },
    fetchReportBySingleProduct({
        commit
    }, payload) {
        return request.post('admin/order/report/product/single', payload).then((response) => response.items)
    },
    fetchIncome({
      commit
    }, payload) {
        return request.post('admin/analytic/income', payload).then((response) => response.items)
    },
    fetchSales({
      commit
    }, payload) {
        return request.post('admin/analytic/sales', payload).then((response) => response.items)
    },
    fetchCoupon({
      commit
    }, payload) {
        return request.post('admin/analytic/coupon', payload).then((response) => response.items)
    },
    fetchScheduleItem({
      commit
    }, payload) {
        return request.post('admin/analytic/scheduleItem', payload).then((response) => response.items)
    },
    analyticsExport({
      commit
    }, {analyticsType,submitData}) {
        return request.post(`admin/analytic/${analyticsType}`, submitData).then((response) => response.items)
    },
  }
