package com.lrm.web.admin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lrm.po.Blog;
import com.lrm.po.User;
import com.lrm.service.BlogService;
import com.lrm.service.TagService;
import com.lrm.service.TypeService;
import com.lrm.util.MarkdownUtils;
import com.lrm.vo.BlogQuery;
import org.springframework.beans.BeanUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.HashMap;
import java.util.UUID;



/**
 * Created by limi on 2017/10/15.
 */
@Controller
@RequestMapping("/admin")
public class BlogController {

    private static final String INPUT = "admin/blogs-input";
    private static final String LIST = "admin/blogs";
    private static final String REDIRECT_LIST = "redirect:/admin/blogs";


    @Autowired
    private BlogService blogService;
    @Autowired
    private TypeService typeService;
    @Autowired
    private TagService tagService;

    @GetMapping("/blogs")
    public String blogs(@PageableDefault(size = 8, sort = {"updateTime"}, direction = Sort.Direction.DESC) Pageable pageable,
                        BlogQuery blog, Model model) {
        model.addAttribute("types", typeService.listType());
        model.addAttribute("page", blogService.listBlog(pageable, blog));
        return LIST;
    }

    @PostMapping("/blogs/search")
    public String search(@PageableDefault(size = 8, sort = {"updateTime"}, direction = Sort.Direction.DESC) Pageable pageable,
                         BlogQuery blog, Model model) {
        model.addAttribute("page", blogService.listBlog(pageable, blog));
        return "admin/blogs :: blogList";
    }


    @GetMapping("/blogs/input")
    public String input(Model model) {
        setTypeAndTag(model);
        model.addAttribute("blog", new Blog());
        return INPUT;
    }

    private void setTypeAndTag(Model model) {
        model.addAttribute("types", typeService.listType());
        model.addAttribute("tags", tagService.listTag());
    }


    @GetMapping("/blogs/{id}/input")
    public String editInput(@PathVariable Long id, Model model) {
        setTypeAndTag(model);
        Blog blog = blogService.getBlog(id);
        blog.init();
        model.addAttribute("blog",blog);
        return INPUT;
    }



    @PostMapping("/blogs")
    public String post(Blog blog, boolean blogview, RedirectAttributes attributes, HttpSession session) {
        blog.setUser((User) session.getAttribute("user"));
        blog.setType(typeService.getType(blog.getType().getId()));
        blog.setTags(tagService.listTag(blog.getTagIds()));
        Blog b;
        if(blogview == true)
        {

            String content = blog.getContent();
            blog.setContent(MarkdownUtils.markdownToHtmlExtensions(content));
//            MarkdownUtils.markdownToHtmlExtensions(blog.getContent());
            return "blog";
        }
        if (blog.getId() == null) {
            b =  blogService.saveBlog(blog);
        } else {
            b = blogService.updateBlog(blog.getId(), blog);
        }

        if (b == null ) {
            attributes.addFlashAttribute("message", "操作失败");
        } else {
            attributes.addFlashAttribute("message", "操作成功");
        }
        return "redirect:/blog/"+blog.getId();
    }

    @PostMapping("/blogs/imageUpload")
    @ResponseBody
    public Object base64Img(@RequestParam("myPhoto") String base64Data, HttpServletRequest request) throws JsonProcessingException {
        HashMap<String,Object> hashMap=new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        try {
            String dataPrix = "";
            String data = "";

            if(base64Data == null || "".equals(base64Data)){
                throw new Exception("上传失败，上传图片数据为空");
            }else{
                String [] d = base64Data.split("base64,");
                if(d != null && d.length == 2){
                    dataPrix = d[0];
                    data = d[1];
                }else{
                    throw new Exception("上传失败，数据不合法");
                }
            }

            String suffix = "";
            if("data:image/jpeg;".equalsIgnoreCase(dataPrix)){//data:image/jpeg;base64,base64编码的jpeg图片数据
                suffix = ".jpg";
            } else if("data:image/x-icon;".equalsIgnoreCase(dataPrix)){//data:image/x-icon;base64,base64编码的icon图片数据
                suffix = ".ico";
            } else if("data:image/gif;".equalsIgnoreCase(dataPrix)){//data:image/gif;base64,base64编码的gif图片数据
                suffix = ".gif";
            } else if("data:image/png;".equalsIgnoreCase(dataPrix)){//data:image/png;base64,base64编码的png图片数据
                suffix = ".png";
            }else{
                throw new Exception("上传图片格式不合法");
            }
            String imgName= UUID.randomUUID().toString();
            String tempFileName = imgName + suffix;


            //因为BASE64Decoder的jar问题，此处使用spring框架提供的工具包
            byte[] bs = Base64Utils.decodeFromString(data);
            try{
                File file=null;
                //使用apache提供的工具类操作流
//                String url = request.getSession().getServletContext().getRealPath("/upload");
                String url = "/home/myblog/blog_image";
//                String url = "j:";
                FileUtils.writeByteArrayToFile(new File(url+"/" + tempFileName), bs);
//                ![](http://106.52.36.59:9999/f69c41a4-d384-45a0-9c8a-3de3afe64011.png)
                String pitureUrl="![](http://blog.bupt.ltd:9999/"+tempFileName+")";
//                String pitureUrl="j:/"+tempFileName;
                System.out.println(pitureUrl);
                hashMap.put("end","OK");
                hashMap.put("url",pitureUrl);
            }catch(Exception ee){

                throw new Exception("上传失败，写入文件失败，"+ee.getMessage());
            }

        }catch (Exception e){
            hashMap.put("end","upload err");
            e.printStackTrace();
        }
        System.out.println(mapper.writeValueAsString(hashMap));
        return mapper.writeValueAsString(hashMap);
    }
    @PostMapping("/blogs/delete_image")
    @ResponseBody
    public String delete_image(@RequestParam("image_name") String image_name, HttpServletRequest request) throws JsonProcessingException {
        String url = "/home/myblog/blog_image/";
//        String url = "j:/";

        HashMap<String,Object> hashMap=new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(url+image_name.replace(")",""));

//        System.out.println(url+image_name);

        //判断文件是否存在
        if (file.exists() == true){
            Boolean flag = false;
            flag = file.delete();
            if (flag){
                hashMap.put("end","OK");
            }else {
                hashMap.put("end","err");
            }
        }else {
            hashMap.put("end","no_image");

        }
        return mapper.writeValueAsString(hashMap);
    }

    @GetMapping("/blogs/{id}/delete")
    public String delete(@PathVariable Long id,RedirectAttributes attributes) {
        blogService.deleteBlog(id);
        attributes.addFlashAttribute("message", "删除成功");
        return REDIRECT_LIST;
    }



}
