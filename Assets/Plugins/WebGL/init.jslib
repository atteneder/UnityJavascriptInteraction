var MyPlugin = {
	StartTests : function() {
		window.run_tests();
	}
}

mergeInto(LibraryManager.library, MyPlugin);
