import ToDoController from "@/controllers/mobile/todo.controller";
import ReminderController from "@/controllers/mobile/reminder.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import InquiryController from "@/controllers/mobile/inquiry.controller";
import DashboardController from "@/controllers/mobile/dashboard.controller";
import RequirementController from "@/controllers/mobile/requirement.controller";
import { fireNotification } from "@/controllers/mobile/notification.controller";
import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import { validate } from "@utils/validate"
import { UserController } from "@/controllers/mobile/auth.controller";
import { mobileLogin } from "@/validation/user.joi.validation";
import { addTodo, updateToDo, deleteTodo, changeTodoStatus } from "@/validation/todo.joi.validation";
import { addReminder, updateReminder, deleteReminder, changeReminderStatus } from "@/validation/reminder.joi.validation";
import { addRequirement, changeRequirementStatus, deleteRequirement, updateRequirement } from "@/validation/requirement.joi.validation";
import { addInquiry, addProductionUserComment, changeInquiryStatus, deleteInquiry, discountOnRequirement, inquiryDetails, updateRemark } from "@/validation/inquiry.joi.validation";
import { ProductController } from "@/controllers/mobile/product.controller";
import { CategoryController } from "@/controllers/mobile/category.controller";
import { addNotification } from "@/validation/notification.joi.validation.";
import { addCategory } from "@/validation/category.validation";
import { addProduct, updateProduct } from "@/validation/product.validation";
import { MessagesController } from "@/controllers/mobile/message.controller";
class apiRoutes implements Routes {
  public path = '/';
  public router = Router();
  public todoController = new ToDoController()
  public userController = new UserController()
  public reminderController = new ReminderController();
  public requirementController = new RequirementController();
  public inquiryController = new InquiryController();
  public dashboardController = new DashboardController();
  public notificationController = new fireNotification();
  public CategoryController = new CategoryController();
  public productController = new ProductController();
  public MessagesController = new MessagesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    // Auth Routes :
    this.router.post(`${this.path}login`, validate(mobileLogin), this.userController.login);
    this.router.post(`${this.path}logout`, authMiddleware, this.userController.logout);

    // Dashboard Routes :
    this.router.get(`${this.path}dashboard`, authMiddleware, this.dashboardController.getDashboardData);
    this.router.post(`${this.path}dashboard-chart`, authMiddleware, this.dashboardController.getDashboardChartData);

    // Todo Routes :
    this.router.post(`${this.path}all-todos`, authMiddleware, this.todoController.allTodos);
    this.router.post(`${this.path}add-todo`, authMiddleware, validate(addTodo), this.todoController.addTodo);
    this.router.post(`${this.path}update-todo`, authMiddleware, validate(updateToDo), this.todoController.updateTodo);
    this.router.delete(`${this.path}delete-todo`, authMiddleware, validate(deleteTodo), this.todoController.deleteTodo);
    this.router.post(`${this.path}change-todo-status`, authMiddleware, validate(changeTodoStatus), this.todoController.changeCompletionStatus);

    // Reminder Routes :
    this.router.post(`${this.path}reminder`, authMiddleware, this.reminderController.allReminders);
    this.router.post(`${this.path}add-reminder`, authMiddleware, validate(addReminder), this.reminderController.addReminder);
    this.router.post(`${this.path}update-reminder`, authMiddleware, validate(updateReminder), this.reminderController.updateReminder);
    this.router.delete(`${this.path}delete-reminder`, authMiddleware, validate(deleteReminder), this.reminderController.deleteReminder);
    this.router.post(`${this.path}change-reminder-status`, authMiddleware, validate(changeReminderStatus), this.reminderController.changeReminderStatus);

    // Requirement Routes:
    this.router.post(`${this.path}requirement`, authMiddleware, this.requirementController.allRequirements);
    this.router.post(`${this.path}user-requirement`, authMiddleware, this.requirementController.getUserRequirements);
    this.router.post(`${this.path}add-requirement`, authMiddleware, validate(addRequirement), this.requirementController.addRequirement);
    this.router.post(`${this.path}update-requirement`, authMiddleware, validate(updateRequirement), this.requirementController.updateRequirement);
    this.router.delete(`${this.path}delete-requirement`, authMiddleware, validate(deleteRequirement), this.requirementController.deleteRequirement);
    this.router.post(`${this.path}change-requirement-status`, authMiddleware, validate(changeRequirementStatus), this.requirementController.changeStatus);

    // Inquiry Routes: 
    this.router.post(`${this.path}inquiry`, authMiddleware, this.inquiryController.allInquiries);
    this.router.post(`${this.path}add-inquiry`, authMiddleware, validate(addInquiry), this.inquiryController.addNewInquiry);
    this.router.post(`${this.path}inquiry-details`, authMiddleware, validate(inquiryDetails), this.inquiryController.getInquiryDetails);
    this.router.post(`${this.path}update-inquiry-remark`, authMiddleware, validate(updateRemark), this.inquiryController.updateInquirRemark);
    this.router.delete(`${this.path}delete-inquiry`, authMiddleware, validate(deleteInquiry), this.inquiryController.deleteInquiry);
    this.router.post(`${this.path}change-inquiry-status`, authMiddleware, validate(changeInquiryStatus), this.inquiryController.changeStatus);
    this.router.post(`${this.path}discount-on-reqirement`, authMiddleware, validate(discountOnRequirement), this.inquiryController.discountOnRequirement);
    this.router.post(`${this.path}add-production-user-comment`, authMiddleware, validate(addProductionUserComment), this.inquiryController.addProductionUserComment);
    this.router.post(`${this.path}party-names`, authMiddleware, this.inquiryController.getpartyNameList);


    // Notification Routes: 
    this.router.post(`${this.path}notification`, authMiddleware, this.notificationController.notificationList);
    this.router.post(`${this.path}add-notification`, authMiddleware, validate(addNotification), this.notificationController.addNewNotification);
    this.router.post(`${this.path}clear-notification`, authMiddleware, this.notificationController.clearNotification);

    // Category
    // this.router.post(`${this.path}add-category`, authMiddleware, validate(addCategory), this.CategoryController.addCategory);
    this.router.post(`${this.path}get-category`, authMiddleware, this.CategoryController.getCategory);
    this.router.post(`${this.path}share-category`, authMiddleware, this.CategoryController.shareCategory);
    this.router.post(`${this.path}search-category-and-product`,this.CategoryController.globalSearchForCategoryAndProduct);


    // Product 
    // this.router.post(`${this.path}add-product`, authMiddleware, validate(addProduct) ,this.productController.addProduct);
    this.router.post(`${this.path}get-product`, authMiddleware, this.productController.getProducts);
    this.router.post(`${this.path}get-product-images`, authMiddleware, this.productController.getProductsImgById);
    this.router.post(`${this.path}share-product`, authMiddleware, this.productController.shareProduct);
    this.router.post(`${this.path}share-images`, this.productController.shareImages);

    //Chat
    this.router.post(`${this.path}store-message`, authMiddleware, this.MessagesController.storeMessage);
    this.router.post(`${this.path}send-documents`, authMiddleware, this.MessagesController.sendDocument);

    
  }
}

export default apiRoutes