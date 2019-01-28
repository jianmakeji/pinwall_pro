module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated()){
       if (ctx.user.Id == 0 && ctx.user.email == '' && ctx.user.openid !=''){
         const wxUser = await ctx.service.users.findByOpenId(ctx.user.openid);
      
         ctx.user.Id = wxUser.Id;
         ctx.user.email = wxUser.email;
         ctx.user.fullname = wxUser.fullname;
         ctx.user.roles = wxUser.roles;
         ctx.user.avatarUrl = wxUser.avatarUrl;
       }
       await  next();
      }
      else{
        ctx.session.returnTo = ctx.url;
        ctx.redirect('/login');
      }

  }
};
