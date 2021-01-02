---
path: /puzzle
---
# iPuzzler Demo
<script type="module" src="js/ipuzzler.js"></script>
<ipuzzler-puzzle>
    Sorry - iPuzzle does not work on your browser.
</ipuzzler-puzzle>
<hr />
<a href="/">Back to puzzle list</a>
</article>
<script>
const urlParams = new URLSearchParams(window.location.search);
const path = urlParams.get('ipuz');
document.querySelector("ipuzzler-puzzle").setAttribute("url", path);
</script>
