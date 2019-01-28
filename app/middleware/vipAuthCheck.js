module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated() ){
        if (ctx.user.Id == 0 && ctx.user.email == '' && ctx.user.openid !=''){
          const wxUser = await ctx.service.users.findByOpenId(ctx.user.openid);
          ctx.user.Id = wxUser.Id;
          ctx.user.email = wxUser.email;
          ctx.user.fullname = wxUser.fullname;
          ctx.user.roles = wxUser.roles;
          ctx.user.avatarUrl = wxUser.avatarUrl;
        }
        if(ctx.user.roles && ctx.user.roles.length > 0){
          if (ctx.user.roles[0].name == 'vip'){
            await  next();
          }
          else{
            ctx.body = {
              success: true,
              status:999,
              data:'没有操作权限，不用重新尝试了',
            };
          }
        }
        else{
          ctx.body = {
            success: true,
            status:999,
            data:'没有操作权限，不用重新尝试了',
          };
        }
      }
      else{
        ctx.body = {
          success: true,
          status:999,
          data:'没有操作权限，请登录',
        };
      }

  }
};
