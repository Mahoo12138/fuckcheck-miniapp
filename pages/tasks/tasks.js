Page({
	data: {
		actions: [
			{
			  type: 'default',
			  text: '编辑',
			},
			{
			  text: '删除',
			  type: 'assertive',
			},
		  ],
	},
    onShow() {
		this.getTabBar().init();
	},
});