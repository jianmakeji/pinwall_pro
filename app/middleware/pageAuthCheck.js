module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated()) {
      if (ctx.user.Id == 0 && ctx.user.email == '' && ctx.user.unionid != '') {
        const wxUser = await ctx.service.users.findByUnionId(ctx.user.unionid);

        ctx.user.Id = wxUser.Id;
        ctx.user.email = wxUser.email;
        ctx.user.fullname = wxUser.fullname;
        ctx.user.roles = wxUser.roles;
        ctx.user.avatarUrl = wxUser.avatarUrl;
        ctx.user.unionid = wxUser.unionid;
      }
      await next();
    } else {
      ctx.session.returnTo = ctx.url;
      ctx.redirect('/login');
    }

  }
};
