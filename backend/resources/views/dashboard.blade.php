@extends('layout.sidebar')

<style>
    body {
        margin: 0;
        padding: 0;
    }
    .dashboard-main {
        height: 100%;
        padding: 40px 32px;
        background: #f7fafc;
        min-height: 100vh;
    }
    .welcome-msg {
        font-size: 1.6rem;
        font-weight: 600;
        color: #2176ae;
        margin-bottom: 18px;
        margin-top: 40px;
    }
    .dashboard-boxes {
        display: flex;
        gap: 32px;
        margin-top: 24px;
        flex-wrap: wrap;
    }
    .dashboard-box {
        flex: 1 1 220px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(30,111,167,0.07);
        padding: 32px 24px;
        text-align: center;
        transition: box-shadow 0.2s;
        cursor: pointer;
        border: 1.5px solid #e0e7ef;
    }
    .dashboard-box a{
        text-decoration: none;
    }
    .dashboard-box:hover {
        box-shadow: 0 8px 24px rgba(30,111,167,0.13);
        border-color: #2bb7a7;
    }
    .dashboard-icon {
        font-size: 2.2rem;
        color: #2bb7a7;
        margin-bottom: 14px;
    }
    .dashboard-title {
        font-size: 1.18rem;
        font-weight: 600;
        color: #2176ae;
        margin-bottom: 6px;
    }
    .dashboard-desc {
        font-size: 0.98rem;
        color: #4a6fa7;
    }

     @media (max-width: 900px) {
         .dashboard-main {
        padding: 20px 10px;
    }
     }
</style>
@section('content')
@include('layout.header')
<div class="dashboard-main">
    <div class="welcome-msg">
        Welcome to the Dashboard, Admin!
    </div>
    <div style="color:#2bb7a7;font-size:1.08rem;margin-bottom:10px;">
        Manage your products, support, and consultations from one place.
    </div>
    <div class="dashboard-boxes">
        
        <div class="dashboard-box">
            <a href="{{ route('products.index') }}">
            <div class="dashboard-icon"><i class="fa-solid fa-box"></i></div>
            <div class="dashboard-title">Products</div>
            </a>
        </div>
        <div class="dashboard-box">
            <a href="{{ route('support') }}">
            <div class="dashboard-icon"><i class="fa-solid fa-chalkboard"></i></div>
            <div class="dashboard-title">Support</div>
            </a>
        </div>
        <div class="dashboard-box">
            <a href="{{ route('consultations.index') }}">
            <div class="dashboard-icon"><i class="fa-solid fa-user-md"></i></div>
            <div class="dashboard-title">Consultation</div>
            </a>
        </div>
    </div>
</div>
@endsection