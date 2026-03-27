import { InferSelectModel } from 'drizzle-orm';
import * as schemas from '../schemas/index';

export const translations: Array<
	Pick<
		InferSelectModel<typeof schemas.referencesTranslationsTable>,
		'lang' | 'namespace' | 'key' | 'value'
	>
> = [
	// English — common namespace
	{ lang: 'en', namespace: 'common', key: 'demo.lang', value: 'English' },
	{
		lang: 'en',
		namespace: 'common',
		key: 'demo.description',
		value: 'The starting point for your next project is based on MUI. Easy customization helps you build apps faster and better.',
	},

	// English — navbar namespace
	{ lang: 'en', namespace: 'navbar', key: 'app', value: 'App' },
	{ lang: 'en', namespace: 'navbar', key: 'job', value: 'Job' },
	{ lang: 'en', namespace: 'navbar', key: 'user', value: 'User' },
	{ lang: 'en', namespace: 'navbar', key: 'travel', value: 'Travel' },
	{ lang: 'en', namespace: 'navbar', key: 'invoice', value: 'Invoice' },
	{ lang: 'en', namespace: 'navbar', key: 'blog.title', value: 'Blog' },
	{
		lang: 'en',
		namespace: 'navbar',
		key: 'blog.caption',
		value: 'Custom keyboard shortcuts.',
	},
	{ lang: 'en', namespace: 'navbar', key: 'subheader', value: 'Sub header' },

	// English — messages namespace
	{
		lang: 'en',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: 'Language has been changed!',
	},
	{
		lang: 'en',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: 'Error changing language!',
	},
	{
		lang: 'en',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'Loading...',
	},

	// Uzbek — common namespace
	{ lang: 'uz', namespace: 'common', key: 'demo.lang', value: "O'zbek" },
	{
		lang: 'uz',
		namespace: 'common',
		key: 'demo.description',
		value: "Sizning keyingi loyihangiz uchun boshlang'ich nuqta MUI ga asoslangan. Oson sozlash ilovalarni tezroq va yaxshiroq yaratishga yordam beradi.",
	},

	// Uzbek — navbar namespace
	{ lang: 'uz', namespace: 'navbar', key: 'app', value: 'Ilova' },
	{ lang: 'uz', namespace: 'navbar', key: 'job', value: 'Ish' },
	{ lang: 'uz', namespace: 'navbar', key: 'user', value: 'Foydalanuvchi' },
	{ lang: 'uz', namespace: 'navbar', key: 'travel', value: 'Sayohat' },
	{ lang: 'uz', namespace: 'navbar', key: 'invoice', value: 'Hisob-faktura' },
	{ lang: 'uz', namespace: 'navbar', key: 'blog.title', value: 'Blog' },
	{
		lang: 'uz',
		namespace: 'navbar',
		key: 'blog.caption',
		value: "Maxsus klaviatura yorliqlari.",
	},
	{
		lang: 'uz',
		namespace: 'navbar',
		key: 'subheader',
		value: "Pastki sarlavha",
	},

	// Uzbek — messages namespace
	{
		lang: 'uz',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: "Til o'zgartirildi!",
	},
	{
		lang: 'uz',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: "Tilni o'zgartirishda xatolik!",
	},
	{
		lang: 'uz',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'Yuklanmoqda...',
	},

	// Russian — common namespace
	{ lang: 'ru', namespace: 'common', key: 'demo.lang', value: 'Русский' },
	{
		lang: 'ru',
		namespace: 'common',
		key: 'demo.description',
		value: 'Отправная точка для вашего следующего проекта основана на MUI. Простая настройка поможет создавать приложения быстрее и лучше.',
	},

	// Russian — navbar namespace
	{ lang: 'ru', namespace: 'navbar', key: 'app', value: 'Приложение' },
	{ lang: 'ru', namespace: 'navbar', key: 'job', value: 'Работа' },
	{ lang: 'ru', namespace: 'navbar', key: 'user', value: 'Пользователь' },
	{ lang: 'ru', namespace: 'navbar', key: 'travel', value: 'Путешествие' },
	{ lang: 'ru', namespace: 'navbar', key: 'invoice', value: 'Счёт-фактура' },
	{ lang: 'ru', namespace: 'navbar', key: 'blog.title', value: 'Блог' },
	{
		lang: 'ru',
		namespace: 'navbar',
		key: 'blog.caption',
		value: 'Пользовательские сочетания клавиш.',
	},
	{
		lang: 'ru',
		namespace: 'navbar',
		key: 'subheader',
		value: 'Подзаголовок',
	},

	// Russian — messages namespace
	{
		lang: 'ru',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: 'Язык был изменён!',
	},
	{
		lang: 'ru',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: 'Ошибка при смене языка!',
	},
	{
		lang: 'ru',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'Загрузка...',
	},

	// French — common namespace
	{ lang: 'fr', namespace: 'common', key: 'demo.lang', value: 'Français' },
	{
		lang: 'fr',
		namespace: 'common',
		key: 'demo.description',
		value: "Le point de départ de votre prochain projet est basé sur MUI. Une personnalisation facile vous aide à créer des applications plus rapidement et mieux.",
	},

	// French — navbar namespace
	{ lang: 'fr', namespace: 'navbar', key: 'app', value: 'Application' },
	{ lang: 'fr', namespace: 'navbar', key: 'job', value: 'Emploi' },
	{ lang: 'fr', namespace: 'navbar', key: 'user', value: 'Utilisateur' },
	{ lang: 'fr', namespace: 'navbar', key: 'travel', value: 'Voyage' },
	{ lang: 'fr', namespace: 'navbar', key: 'invoice', value: 'Facture' },
	{ lang: 'fr', namespace: 'navbar', key: 'blog.title', value: 'Blog' },
	{
		lang: 'fr',
		namespace: 'navbar',
		key: 'blog.caption',
		value: 'Raccourcis clavier personnalisés.',
	},
	{ lang: 'fr', namespace: 'navbar', key: 'subheader', value: 'Sous-en-tête' },

	// French — messages namespace
	{
		lang: 'fr',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: 'La langue a été changée !',
	},
	{
		lang: 'fr',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: 'Erreur lors du changement de langue !',
	},
	{
		lang: 'fr',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'Chargement...',
	},

	// Vietnamese — common namespace
	{ lang: 'vi', namespace: 'common', key: 'demo.lang', value: 'Tiếng Việt' },
	{
		lang: 'vi',
		namespace: 'common',
		key: 'demo.description',
		value: 'Điểm khởi đầu cho dự án tiếp theo của bạn dựa trên MUI. Tùy chỉnh dễ dàng giúp bạn xây dựng ứng dụng nhanh hơn và tốt hơn.',
	},

	// Vietnamese — navbar namespace
	{ lang: 'vi', namespace: 'navbar', key: 'app', value: 'Ứng dụng' },
	{ lang: 'vi', namespace: 'navbar', key: 'job', value: 'Việc làm' },
	{ lang: 'vi', namespace: 'navbar', key: 'user', value: 'Người dùng' },
	{ lang: 'vi', namespace: 'navbar', key: 'travel', value: 'Du lịch' },
	{ lang: 'vi', namespace: 'navbar', key: 'invoice', value: 'Hóa đơn' },
	{ lang: 'vi', namespace: 'navbar', key: 'blog.title', value: 'Blog' },
	{
		lang: 'vi',
		namespace: 'navbar',
		key: 'blog.caption',
		value: 'Phím tắt tùy chỉnh.',
	},
	{ lang: 'vi', namespace: 'navbar', key: 'subheader', value: 'Tiêu đề phụ' },

	// Vietnamese — messages namespace
	{
		lang: 'vi',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: 'Ngôn ngữ đã được thay đổi!',
	},
	{
		lang: 'vi',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: 'Lỗi khi thay đổi ngôn ngữ!',
	},
	{
		lang: 'vi',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'Đang tải...',
	},

	// Chinese — common namespace
	{ lang: 'cn', namespace: 'common', key: 'demo.lang', value: '中文' },
	{
		lang: 'cn',
		namespace: 'common',
		key: 'demo.description',
		value: '您下一个项目的起点基于MUI。简单的自定义帮助您更快更好地构建应用程序。',
	},

	// Chinese — navbar namespace
	{ lang: 'cn', namespace: 'navbar', key: 'app', value: '应用' },
	{ lang: 'cn', namespace: 'navbar', key: 'job', value: '工作' },
	{ lang: 'cn', namespace: 'navbar', key: 'user', value: '用户' },
	{ lang: 'cn', namespace: 'navbar', key: 'travel', value: '旅行' },
	{ lang: 'cn', namespace: 'navbar', key: 'invoice', value: '发票' },
	{ lang: 'cn', namespace: 'navbar', key: 'blog.title', value: '博客' },
	{
		lang: 'cn',
		namespace: 'navbar',
		key: 'blog.caption',
		value: '自定义键盘快捷键。',
	},
	{ lang: 'cn', namespace: 'navbar', key: 'subheader', value: '子标题' },

	// Chinese — messages namespace
	{
		lang: 'cn',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: '语言已更改！',
	},
	{
		lang: 'cn',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: '更改语言时出错！',
	},
	{
		lang: 'cn',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: '加载中...',
	},

	// Arabic — common namespace
	{ lang: 'ar', namespace: 'common', key: 'demo.lang', value: 'العربية' },
	{
		lang: 'ar',
		namespace: 'common',
		key: 'demo.description',
		value: 'نقطة البداية لمشروعك القادم مبنية على MUI. التخصيص السهل يساعدك على بناء التطبيقات بشكل أسرع وأفضل.',
	},

	// Arabic — navbar namespace
	{ lang: 'ar', namespace: 'navbar', key: 'app', value: 'تطبيق' },
	{ lang: 'ar', namespace: 'navbar', key: 'job', value: 'وظيفة' },
	{ lang: 'ar', namespace: 'navbar', key: 'user', value: 'مستخدم' },
	{ lang: 'ar', namespace: 'navbar', key: 'travel', value: 'سفر' },
	{ lang: 'ar', namespace: 'navbar', key: 'invoice', value: 'فاتورة' },
	{ lang: 'ar', namespace: 'navbar', key: 'blog.title', value: 'مدونة' },
	{
		lang: 'ar',
		namespace: 'navbar',
		key: 'blog.caption',
		value: 'اختصارات لوحة المفاتيح المخصصة.',
	},
	{ lang: 'ar', namespace: 'navbar', key: 'subheader', value: 'عنوان فرعي' },

	// Arabic — messages namespace
	{
		lang: 'ar',
		namespace: 'messages',
		key: 'languageSwitch.success',
		value: 'تم تغيير اللغة!',
	},
	{
		lang: 'ar',
		namespace: 'messages',
		key: 'languageSwitch.error',
		value: 'خطأ في تغيير اللغة!',
	},
	{
		lang: 'ar',
		namespace: 'messages',
		key: 'languageSwitch.loading',
		value: 'جاري التحميل...',
	},
];
