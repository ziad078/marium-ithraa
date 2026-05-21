import { FormTypes } from "@/lib/types/enums";
import { IFormFieldsVariables, IFormField } from "@/lib/types/interfaces";



const useFormFields = ({ slug, data }: IFormFieldsVariables) => {
  const loginFields = (): IFormField[] => [
    {
      name: "phone",
      type: "tel",
      label: "رقم الهاتف",
      placeholder: "ادخل رقم الهاتف",
      autoFocus: true,
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "ادخل كلمة المرور",
    },
  ];
  const employeeFields = (): IFormField[] => [
    {
      name: "name",
      type: "text",
      label: "name",
      placeholder: "enter employee name",
      autoFocus: true,
    },
    {
      name: "phone",
      type: "tel",
      label: "رقم الهاتف",
      placeholder: "ادخل رقم الهاتف",
    },
    {
      name: "email",
      type: "email",
      label: "email",
      placeholder: "enters the employee email",
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "ادخل كلمة المرور",
    },
    {
      name: "job_title",
      type: "text",
      label: "الوظيفة",
      placeholder: "job",
    },
  ]
  const enricherFields = (): IFormField[] => [
    {
      name: "name",
      type: "text",
      label: "name",
      placeholder: "enter employee name",
      autoFocus: true,
    },
    {
      name: "phone",
      type: "tel",
      label: "رقم الهاتف",
      placeholder: "ادخل رقم الهاتف",
    },
    {
      name: "email",
      type: "email",
      label: "email",
      placeholder: "enters the employee email",
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "ادخل كلمة المرور",
    },
    {
      name: "organizationName",
      type: "text",
      label: "اسم المؤسسة",
      placeholder: "org2",
    },
  ]
  const teacherFields = (): IFormField[] => [
    {
      name: "name",
      type: "text",
      label: "اسم المعلم",
      placeholder: "أدخل اسم المعلم",
      autoFocus: true,
    },
    {
      name: "email",
      type: "email",
      label: "البريد الإلكتروني",
      placeholder: "أدخل البريد الإلكتروني",
    },
    {
      name: "phone",
      type: "tel",
      label: "رقم الهاتف",
      placeholder: "أدخل رقم الهاتف",
    },
    {
      name: "password",
      type: "password",
      label: "كلمة المرور",
      placeholder: "أدخل كلمة المرور",
    },
    {
      name: "jobTitle",        // اسم الـ field زي ما هو في الـ API payload
      type: "text",
      label: "المسمى الوظيفي",
      placeholder: "أدخل المسمى الوظيفي",
    },
  ]
  const testFields = (): IFormField[] => [
    {
      name: "title",
      type: "text",
      autoFocus: true,
      placeholder: "enter the test title",
      label: "title"
    },
    {
      name: "description",
      type: "text",
      placeholder: "enter the test description",
      label: "description"
    },
    // {
    //   name: "title",
    //   type: "text",
    //   autoFocus: true,
    //   placeholder: "enter the test title",
    //   label: "title"
    // },
  ]

  const questionFields = (): IFormField[] => [
    {
      name: "content",
      type: "text",
      autoFocus: true,
      placeholder: "enter the question content",
      label: "content"
    },

  ]
  const answerFields = (): IFormField[] => [
    {
      name: "text",
      type: "text",
      autoFocus: true,
      placeholder: "enter the answer text",
      label: "text"
    },
    {
      name: "score",
      type: "text",
      placeholder: "enter the answer score",
      label: "score"
    },

  ]




  const getFormFields = (): IFormField[] | [] => {
    switch (slug) {
      case FormTypes.SIGNIN:
        return loginFields();
      case FormTypes.EMPLOYEE:
        return employeeFields();
      case FormTypes.ENRICHER:
        return enricherFields();
      case FormTypes.TEST:
        return testFields()
      case FormTypes.QUESTIONS:
        return questionFields()
      case FormTypes.ANS:
        return answerFields()
      case FormTypes.TEACHER:
        return teacherFields()
      default:
        return [];
    }
  };

  return { getFormFields };
};

export default useFormFields;
