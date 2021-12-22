import { BASE_SERVER } from './Config';

/**
 * API URLs
 */

export const BASE_URL = BASE_SERVER + '/api/v1/';
export const LOGIN = 'auth/login/';
export const SIGNUP = 'auth/register/';
export const CONFIRM_SIGNUP = 'auth/validate_register/';
export const LOGOUT = 'auth/logout/';
export const FREE_ENROLLMENT = 'courses/%s/enroll_for_free/';
export const RESET_PASSWORD = 'auth/password_reset/';
export const RESEND_VERIFICATION_EMAIL = 'auth/resend_verification_email/';
export const CONFIRM_RESET_PASSWORD = 'auth/password_reset_confirm/';
export const COURSES = 'courses/';
export const FETCH_COURSE_ENROLLMENT_STATUS = 'courses/%s/enrolled/';
export const FETCH_COURSE_OVERVIEW = 'courses/%s/';
export const FETCH_COURSE_MODULE = 'courses/%s/modules/';
export const FETCH_COURSE_FINAL_PRICE = 'courses/%s/course_price/';
export const FETCH_COURSE_LANGUAGES = 'courses/%s/languages/';
export const UPDATE_PREFERRED_LANGUAGE = 'courses/%s/update_language_preference/';
export const UPDATE_WATCHED_STATUS = 'subtopics/%s/watched/';
export const FETCH_COURSE_PROGRESS = 'courses/%s/user_course_status/';
export const FETCH_PRACTICE_QUESTIONS = 'topics/%s/practice_questions/';
export const FETCH_PRACTICE_QUESTION = 'practice_questions/%s/';
export const SUBMIT_PRACTICE_QUESTION_ANSWER = 'practice_questions/%s/submit/';
export const FETCH_DISCUSSION_QUESTIONS = 'topics/%s/discussion_questions/';
export const FETCH_DISCUSSION_QUESTION = 'discussion_questions/%s/';
export const FETCH_DISCUSSION_QUESTION_ANSWERS = 'discussion_questions/%s/answers/';
export const FETCH_DISCUSSION_QUESTION_COMMENTS = 'discussion_question_comments/';
export const FETCH_DISCUSSION_ANSWER_COMMENTS = 'discussion_question_answer_comments/';
export const FETCH_DISCUSSION_QUESTION_REPLIES = 'discussion_question_comment_replies/';
export const FETCH_DISCUSSION_ANSWER_REPLIES = 'discussion_question_answer_comment_replies/';
export const POST_ANSWER = 'discussion_question_answers/';
export const POST_QUESTION = 'discussion_questions/';
export const POST_QUESTION_COMMENT = 'discussion_question_comments/';
export const POST_ANSWER_COMMENT = 'discussion_question_answer_comments/';
export const POST_QUESTION_REPLY = 'discussion_question_comment_replies/';
export const POST_ANSWER_REPLY = 'discussion_question_answer_comment_replies/';
export const DELETE_QUESTION = 'discussion_questions/%s/';
export const DELETE_ANSWER = 'discussion_question_answers/%s/';
export const LIKE_QUESTION = 'discussion_questions/%s/like/';
export const LIKE_ANSWER = 'discussion_question_answers/%s/like/';
export const FOLLOW_QUESTION = 'discussion_questions/%s/follow/';
export const UPDATE_QUESTION = 'discussion_questions/%s/';
export const UPDATE_ANSWER = 'discussion_question_answers/%s/';
export const FETCH_PROFILE_DETAIL = 'users/%s/';
export const UPDATE_PROFILE_DETAIL = 'users/%s/';
export const UPDATE_PROFILE_PIC = 'users/%s/upload_profile_pic/';
export const REMOVE_PROFILE_PIC = 'users/%s/remove_profile_pic/';
export const FETCH_USER_COURSES = 'users/%s/courses_enrolled/';
export const FETCH_QUESTIONS_ASKED = 'users/%s/questions_asked/';
export const FETCH_QUESTIONS_FOLLOWED = 'users/%s/followed_questions/';
export const FETCH_QUESTIONS_ANSWERED = 'users/%s/questions_answered/';
export const CHANGE_PASSWORD = 'auth/password_change/';
export const CHANGE_EMAIL = 'auth/email_change/';
export const CONFIRM_CHANGE_EMAIL = 'auth/email_change_confirm/';
export const GOOGLE_LOGIN = 'auth/google_login/';
export const USERNAME_TAKEN = 'auth/username_taken/';
export const EMAIL_TAKEN = 'auth/email_taken/';
export const FETCH_BILLING_DETAIL = 'billing_details/';
export const UPDATE_BILLING_DETAIL = 'billing_details/%s/';
export const CREATE_ORDER = 'courses/%s/purchase/';
export const ORDER_STATUS = 'orders/%s/status/';
export const FETCH_BILLING_HISTORY = 'orders/';
export const GET_INVOICE_URL = 'payments/%s/invoice_url/';
export const CERTIFICATE_GENERATED_STATUS = 'courses/%s/course_certificate_generated_status/';
export const GET_CERTIFICATE_URL = 'courses/%s/completion_certificate/';
export const APPLY_REFERRAL_CODE = 'courses/%s/apply_referral_code/';
export const FETCH_REFERRAL_CODE = 'users/%s/referral_code/';
export const FETCH_CREDITS = 'users/%s/credits/';
export const TOPIC_DETAIL = 'topics/%s/';
export const RETRIEVE_COURSE_RATING = 'courses/%s/get_rating/';
export const CREATE_COURSE_RATING = 'courses/%s/create_rating/';
export const UPDATE_COURSE_RATING = 'courses/%s/update_rating/';
export const RETRIEVE_SUBTOPIC_RATING = 'subtopics/%s/get_rating/';
export const CREATE_SUBTOPIC_RATING = 'subtopics/%s/create_rating/';
export const SET_SOURCE_DATA = 'users/%s/source_data/';

/**
 * Firebase URLs
 */
export const NOTIFICATIONS_URL = '/notifications/%s/notifs/';
export const NOTIFICATIONS_HAS_SEEN_URL = '/notifications/%s/has_seen_notification';
export const MARK_NOTIFICATION_READ = 'users/%s/mark_notification_read/';
export const UPDATE_HAS_SEEN_NOTIFICATION = 'users/%s/has_seen_notification/';
