"use strict";
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var UserCenterExactActivitiesPost_1 = require("./UserCenterExactActivitiesPost");
var AppState_1 = require("../States/AppState");
var UserCenterMyFavoritesPosts = (function (_super) {
    __extends(UserCenterMyFavoritesPosts, _super);
    function UserCenterMyFavoritesPosts(props) {
        var _this = _super.call(this, props) || this;
        //临时填充数据
        _this.state = { userRecentPosts: [userRecentPost, userRecentPost, userRecentPost, userRecentPost] };
        return _this;
    }
    UserCenterMyFavoritesPosts.prototype.render = function () {
        //state转换为JSX
        var userRecentPosts = this.state.userRecentPosts.map(function (item) { return (React.createElement(UserCenterExactActivitiesPost_1.UserCenterExactActivitiesPost, { userRecentPost: item })); });
        //添加分隔线
        for (var i = 1; i < userRecentPosts.length; i += 2) {
            userRecentPosts.splice(i, 0, React.createElement("hr", null));
        }
        return (React.createElement("div", { className: 'user-posts' }, userRecentPosts));
    };
    return UserCenterMyFavoritesPosts;
}(React.Component));
exports.UserCenterMyFavoritesPosts = UserCenterMyFavoritesPosts;
//临时填充数据
var userRecentPost = new AppState_1.UserRecentPost();
userRecentPost.approval = 666;
userRecentPost.board = '学术信息';
userRecentPost.content = '这是帖子内容';
userRecentPost.date = '2017-8-18';
userRecentPost.disapproval = 233;
userRecentPost.title = '这是帖子标题';
//# sourceMappingURL=UserCenterMyFavoritesPosts.js.map