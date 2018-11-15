'use strict'

const assert = require('chai').assert

module.exports = {
  assertRevert: function (promise, err) {
    return promise
      .then(function () {
        assert.isNotOk(true, err)
      })
      .catch(function (e) {
        assert.include(
          e.message,
          'revert',
          'contract didn\'t throw as expected'
        )
      })
  }
}
