module.exports = () => {
  return async (ctx, next) => {
    if (ctx.isAuthenticated() ){
        if (ctx.user.Id == 0 && ctx.user.email == '' && ctx.user.unionid !=''){
          const wxUser = await ctx.service.users.findByUnionId(ctx.user.unionid);

          ctx.user.Id = wxUser.Id;
          ctx.user.email = wxUser.email;
          ctx.user.fullname = wxUser.fullname;
          ctx.user.roles = wxUser.roles;
          ctx.user.avatarUrl = wxUser.avatarUrl;
          ctx.user.unionid = wxUser.unionid;
        }
        if(ctx.user.roles && ctx.user.roles.length > 0){
          if (ctx.user.roles[0].name == 'admin'){
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
