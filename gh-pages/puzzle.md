---
path: /puzzle
layout: default
title: iPuzzler
---
# iPuzzler Demo
<ipuzzler-puzzle>
    Sorry - iPuzzle does not work on your browser.
</ipuzzler-puzzle>
<script>
const urlParams = new URLSearchParams(window.location.search);
const path = urlParams.get('ipuz');
document.querySelector("ipuzzler-puzzle").setAttribute("url", path);
</script>
