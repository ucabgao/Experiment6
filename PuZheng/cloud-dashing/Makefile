GH_PAGES_SOURCES = docs
gh-pages:
	git checkout gh-pages
	rm -rf build _sources _static
	git checkout master $(GH_PAGES_SOURCES)
	git reset HEAD
	cd docs; make html; cd ..;
	cp -rf docs/build/html/* ./
	rm -rf $(GH_PAGES_SOURCES) build upload
	git add -A
	git commit -m "Generated gh-pages for `git log master -1 --pretty=short --abbrev-commit`" && git push origin gh-pages; 
	git checkout master
