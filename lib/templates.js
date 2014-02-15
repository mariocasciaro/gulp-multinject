
module.exports = {
  "jade": {
    startTag: "//INJECT:<%= name %>",
    endTag: "//END INJECT",
    template: {
      "js": "script(src='<%= url %>')",
      "css": "link(rel='stylesheet', href='<%= url %>')",
      "jade": "include <%= url %>"
    }
  },
  "html": {
    startTag: "<!--INJECT:<%= name %>-->",
    endTag: "<!--END INJECT-->",
    template: {
      "js": "<script src='<%= url %>'></script>",
      "css": "<link rel='stylesheet' type='text/css' href='<%= url %>'>"
    }
  }
};