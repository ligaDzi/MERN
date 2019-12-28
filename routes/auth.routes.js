const { Router } = require('express')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const router = Router()

// /api/auth/register
router.post(
    '/register', 
    [
        // массив midleware'ов. Здесь происходит валидация
        check('email', 'Неверный пароль').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ], 
    async (req, res) => {
        try {
            // Все ли пришедшие данные прошли валидацию
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({ 
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации.' 
                })
            }

            const { email, password } = req.body

            // Есть ли пользователь уже в БД
            const candidate = await User.findOne({ email })
            if(candidate){
                return res.status(400).json({ message: 'Такой пользователь уже существует.' })
            }


            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 12)

            // Сохранение пользователя в БД
            const user = new User({
                email,
                password: hashedPassword
            })

            await user.save()

            res.status(201).json({ message: 'Пользователь создан.' })
            
        } catch (err) {
            res.status(500).json({ message: 'Что-то пошло не так, плпробуйте снова.' })
        }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()                            // Пароль должен существовать
    ],
    async (req, res) => {
        try {
            // Все ли пришедшие данные прошли валидацию
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({ 
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему.' 
                })
            }
    
            const { email, password } = req.body
            
            //ПРОВЕРЯЕМ ЕСТЬ ЛИ ПОЛЬЗОВАТЕЛЬ В БД
            const user = await User.findOne({ email })
            if(!user){
                return res.status(400).json({ message: 'Эмеил или пароль ввиден не правильно.' })
            }    

            //ПРОВЕРЯЕМ ВЕРНЫЙ ЛИ ПАРОЛЬ
            //СРАВНИВАЕМ ВВЕДЕНЫЙ ПАРОЛЬ ПОЛЬЗОВАТЕЛЕМ И ХЭШИРОВАННЫЙ ПАРОЛЬ ХРАНЯЩИЙСЯ В БД
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(400).json({ message: 'Эмеил или пароль ввиден не правильно.' })
            }

            //СОЗДАЕМ И ПЕРЕДАЕМ ПОЛЬЗОВАТЕЛЮ  JSON WEB TOKEN
            //ЭТОТ ТОКЕН БУДЕТ ХРАНИТЬСЯ У ПОЛЬЗОВАТЕЛЯ В КУКИ 
            //И ЕМУ БУДЕТ ОТКРЫТ ДОСТУП НА ЗАКРЫТЫЕ СТРАНИЦЫ ДЛЯ НЕ ЗАРЕГИСТРИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ 
            const token = jwt.sign( 
                { userId: user.id }, 
                config.get('jwtSecret'),
                { expiresIn: '1h' }         // Сколько времени будет доступен этот токен на клиенте
            )
            res.json({ token, userId: user.id })

        } catch (err) {
            res.status(500).json({ message: 'Что-то пошло не так, плпробуйте снова.' })
        }
})

module.exports = router